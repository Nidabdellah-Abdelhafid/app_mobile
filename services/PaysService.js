import { URL_BACKEND } from 'api';
import axios from 'axios';

const Pays_API_BASE_URL = `${URL_BACKEND}/api/pays?populate=*&pagination[limit]=-1`;

class PaysService {

    // Fetch all pays
    getPays() {
        return axios.get(Pays_API_BASE_URL);
    }


    // Get a pays by its ID
    getPaysById(pays_id) {
        return axios.get(`${URL_BACKEND}/api/pays/${pays_id}?populate=*&pagination[limit]=-1`);
    }

    // Get all pays related to a specific restaurant
    getRestaurantPaysById(restaurant_id) {
        return axios.get(`http://localhost:2026/Vill_Zone/findPaysResrById/${restaurant_id}`);
    }

    // Get all pays for restaurant PT
    getRestaurantPaysPT() {
        return axios.get("http://localhost:2026/Vill_Zone/findPaysResrPT");
    }

}

export default new PaysService();