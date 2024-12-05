import { URL_BACKEND } from 'api';
import axios from 'axios';

const Carte_API_BASE_URL = `${URL_BACKEND}/api/cartes?populate=*&pagination[limit]=-1`;

class CarteService {

    // Fetch all cartes
    getCarte() {
        return axios.get(Carte_API_BASE_URL);
    }


    // Get a cartes by its ID
    getCarteById(cartes_id) {
        return axios.get(`${URL_BACKEND}/api/cartes/${cartes_id}?populate=*&pagination[limit]=-1`);
    }


}

export default new CarteService();
