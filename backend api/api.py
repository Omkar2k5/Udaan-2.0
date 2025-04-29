from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
import time
import base64
import io
import re
import logging
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from PIL import Image

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)


def setup_selenium_driver():
    """Set up headless Chrome driver for Selenium"""
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")

    driver = webdriver.Chrome(options=chrome_options)
    return driver


def capture_element_screenshot(driver, element):
    """Capture a screenshot of a specific element and return as base64"""
    try:
        # Scroll element into view
        driver.execute_script("arguments[0].scrollIntoView();", element)
        time.sleep(1)  # Allow time for any animations to complete

        # Take the screenshot
        element_png = element.screenshot_as_png

        # Convert to base64
        img_base64 = base64.b64encode(element_png).decode('utf-8')
        return img_base64
    except Exception as e:
        logger.error(f"Error capturing element screenshot: {str(e)}")
        return None


def capture_table_as_text(table_element):
    """Extract text content from a table element"""
    rows = []
    try:
        # Get all rows
        tr_elements = table_element.find_elements(By.TAG_NAME, "tr")

        for tr in tr_elements:
            row_data = []
            # Get all cells (th and td)
            th_elements = tr.find_elements(By.TAG_NAME, "th")
            td_elements = tr.find_elements(By.TAG_NAME, "td")

            for th in th_elements:
                row_data.append(th.text.strip())

            for td in td_elements:
                row_data.append(td.text.strip())

            if row_data:  # Only add non-empty rows
                rows.append(row_data)

        return rows
    except Exception as e:
        logger.error(f"Error capturing table as text: {str(e)}")
        return []


def search_urban_property_by_name(form_data):
    """Submit search form for urban property by name"""
    driver = setup_selenium_driver()
    result = {"success": False, "data": None, "error": None}

    try:
        # Load the search by name page
        url = "https://esearch.delhigovt.nic.in/SearchByName1.aspx"
        driver.get(url)

        # Wait for the page to load
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "ddlSRO")))

        # Fill form fields
        party_name = form_data.get("party_name", "")
        sro = form_data.get("sro", "")
        reg_year = form_data.get("reg_year", "")

        # Select SRO from dropdown
        if sro:
            sro_dropdown = Select(driver.find_element(By.ID, "ddlSRO"))
            try:
                sro_dropdown.select_by_visible_text(sro)
            except NoSuchElementException:
                # If exact match not found, try to find a partial match
                options = sro_dropdown.options
                for option in options:
                    if sro.lower() in option.text.lower():
                        option.click()
                        break

        # Enter party name
        if party_name:
            driver.find_element(By.ID, "txtpartyname").send_keys(party_name)

        # Select registration year
        if reg_year:
            year_dropdown = Select(driver.find_element(By.ID, "ddlYear"))
            try:
                year_dropdown.select_by_visible_text(reg_year)
            except NoSuchElementException:
                # Try to find closest match
                options = year_dropdown.options
                for option in options:
                    if reg_year in option.text:
                        option.click()
                        break

        # Click search button
        search_button = driver.find_element(By.ID, "btnSearch")
        search_button.click()

        # Wait for results
        time.sleep(3)  # Allow time for results to load

        # Check if results are available
        try:
            results_table = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "grdSearchResult"))
            )

            # Get table content as text
            table_data = capture_table_as_text(results_table)

            # Also capture screenshot of results
            table_image = capture_element_screenshot(driver, results_table)

            result["success"] = True
            result["data"] = {
                "table_data": table_data,
                "image": table_image
            }

        except TimeoutException:
            # Check if there's a "no records found" message
            try:
                no_records_element = driver.find_element(By.ID, "lblNoRecords")
                if no_records_element.is_displayed():
                    result["success"] = True
                    result["data"] = {"message": "No records found"}
                else:
                    result["error"] = "Timeout waiting for results"
            except NoSuchElementException:
                result["error"] = "Timeout waiting for results"

    except Exception as e:
        logger.error(f"Error in urban property search by name: {str(e)}")
        result["error"] = str(e)

    finally:
        driver.quit()

    return result


def search_urban_property_by_address(form_data):
    """Submit search form for urban property by address"""
    driver = setup_selenium_driver()
    result = {"success": False, "data": None, "error": None}

    try:
        # Load the search by address page
        url = "https://esearch.delhigovt.nic.in/SearchByAdd.aspx"
        driver.get(url)

        # Wait for the page to load
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "ddlSRO")))

        # Fill form fields
        address = form_data.get("address", "")
        sro = form_data.get("sro", "")
        reg_year = form_data.get("reg_year", "")

        # Select SRO from dropdown
        if sro:
            sro_dropdown = Select(driver.find_element(By.ID, "ddlSRO"))
            try:
                sro_dropdown.select_by_visible_text(sro)
            except NoSuchElementException:
                # If exact match not found, try to find a partial match
                options = sro_dropdown.options
                for option in options:
                    if sro.lower() in option.text.lower():
                        option.click()
                        break

        # Enter address
        if address:
            driver.find_element(By.ID, "txtaddress").send_keys(address)

        # Select registration year
        if reg_year:
            year_dropdown = Select(driver.find_element(By.ID, "ddlYear"))
            try:
                year_dropdown.select_by_visible_text(reg_year)
            except NoSuchElementException:
                # Try to find closest match
                options = year_dropdown.options
                for option in options:
                    if reg_year in option.text:
                        option.click()
                        break

        # Click search button
        search_button = driver.find_element(By.ID, "btnSearch")
        search_button.click()

        # Wait for results
        time.sleep(3)  # Allow time for results to load

        # Check if results are available
        try:
            results_table = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "grdSearchResult"))
            )

            # Get table content as text
            table_data = capture_table_as_text(results_table)

            # Also capture screenshot of results
            table_image = capture_element_screenshot(driver, results_table)

            result["success"] = True
            result["data"] = {
                "table_data": table_data,
                "image": table_image
            }

        except TimeoutException:
            # Check if there's a "no records found" message
            try:
                no_records_element = driver.find_element(By.ID, "lblNoRecords")
                if no_records_element.is_displayed():
                    result["success"] = True
                    result["data"] = {"message": "No records found"}
                else:
                    result["error"] = "Timeout waiting for results"
            except NoSuchElementException:
                result["error"] = "Timeout waiting for results"

    except Exception as e:
        logger.error(f"Error in urban property search by address: {str(e)}")
        result["error"] = str(e)

    finally:
        driver.quit()

    return result


def search_rural_property(form_data):
    """Submit search form for rural property"""
    driver = setup_selenium_driver()
    result = {"success": False, "data": None, "error": None}

    try:
        # Load the rural property search page
        url = "https://gsdl.org.in/revenue/#"
        driver.get(url)

        # Wait for the page to load
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "district")))

        # Fill form fields
        district = form_data.get("district", "")
        division = form_data.get("division", "")
        village = form_data.get("village", "")
        rectangle = form_data.get("rectangle", "")
        khasra = form_data.get("khasra", "")

        # Select district
        if district:
            district_dropdown = Select(driver.find_element(By.ID, "district"))
            try:
                district_dropdown.select_by_visible_text(district)
            except NoSuchElementException:
                # Try to find closest match
                options = district_dropdown.options
                for option in options:
                    if district.lower() in option.text.lower():
                        option.click()
                        break

        # Wait for division dropdown to be populated
        time.sleep(1)

        # Select division
        if division:
            division_dropdown = Select(driver.find_element(By.ID, "division"))
            try:
                division_dropdown.select_by_visible_text(division)
            except NoSuchElementException:
                # Try to find closest match
                options = division_dropdown.options
                for option in options:
                    if division.lower() in option.text.lower():
                        option.click()
                        break

        # Wait for village dropdown to be populated
        time.sleep(1)

        # Select village
        if village:
            village_dropdown = Select(driver.find_element(By.ID, "village"))
            try:
                village_dropdown.select_by_visible_text(village)
            except NoSuchElementException:
                # Try to find closest match
                options = village_dropdown.options
                for option in options:
                    if village.lower() in option.text.lower():
                        option.click()
                        break

        # Enter rectangle
        if rectangle:
            driver.find_element(By.ID, "rectangle").send_keys(rectangle)

        # Enter khasra
        if khasra:
            driver.find_element(By.ID, "khasra").send_keys(khasra)

        # Click search button
        search_button = driver.find_element(By.ID, "searchButton")
        search_button.click()

        # Wait for results
        time.sleep(3)  # Allow time for results to load

        # Check if results are available
        try:
            results_container = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "resultsContainer"))
            )

            # Get text content
            results_text = results_container.text

            # Also capture screenshot of results
            results_image = capture_element_screenshot(driver, results_container)

            result["success"] = True
            result["data"] = {
                "text": results_text,
                "image": results_image
            }

        except TimeoutException:
            result["error"] = "Timeout waiting for results"

    except Exception as e:
        logger.error(f"Error in rural property search: {str(e)}")
        result["error"] = str(e)

    finally:
        driver.quit()

    return result


@app.route('/property-search', methods=['POST'])
def property_search():
    """API endpoint for property search"""
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    form_data = request.get_json()

    # Validate request
    if not form_data:
        return jsonify({"error": "No form data provided"}), 400

    property_type = form_data.get("property_type")
    if not property_type:
        return jsonify({"error": "Property type is required"}), 400

    if property_type.lower() == "urban":
        # Check if party_type is specified
        party_type = form_data.get("party_type", "").lower()

        if party_type == "address":
            result = search_urban_property_by_address(form_data)
        else:
            # Default to search by name
            result = search_urban_property_by_name(form_data)

    elif property_type.lower() == "rural":
        result = search_rural_property(form_data)

    else:
        return jsonify({"error": f"Invalid property type: {property_type}"}), 400

    if result["success"]:
        return jsonify({"success": True, "data": result["data"]})
    else:
        return jsonify({"success": False, "error": result["error"]}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)