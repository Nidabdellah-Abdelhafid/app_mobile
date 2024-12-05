import { URL_BACKEND } from 'api';
import axios from 'axios';

const Planing_API_BASE_URL = `${URL_BACKEND}/api/planings?populate=*&pagination[limit]=-1`;

class PlaningService {

    // Fetch all planings
    getPlaning() {
        return axios.get(Planing_API_BASE_URL);
    }


    // Get a planings by its ID
    getPlaningById(planings_id) {
        return axios.get(`${URL_BACKEND}/api/planings/${planings_id}?populate=*&pagination[limit]=-1`);
    }

}

export default new PlaningService();
