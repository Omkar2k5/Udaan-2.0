import { initializeApp } from "firebase/app"
import { getDatabase, ref, set } from "firebase/database"
import locations from "../data/delhi_locations.json"

const firebaseConfig = {
  databaseURL: "https://uddan-2-0-default-rtdb.asia-southeast1.firebasedatabase.app"
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

async function importLocations() {
  try {
    // Import rural data
    await set(ref(db, "locations/rural"), locations.rural)
    console.log("Rural data imported successfully")

    // Import urban data
    await set(ref(db, "locations/urban"), locations.urban)
    console.log("Urban data imported successfully")

    console.log("All data imported successfully!")
  } catch (error) {
    console.error("Error importing data:", error)
  }
}

importLocations() 