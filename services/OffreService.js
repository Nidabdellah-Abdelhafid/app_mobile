import { URL_BACKEND } from 'api';
import axios from 'axios';

const Offre_API_BASE_URL = `${URL_BACKEND}/api/offres?populate=*&pagination[limit]=-1`;

class OffreService {

    // Fetch all offre
    getOffre() {
        return axios.get(Offre_API_BASE_URL);
    }


    // Get a offre by its ID
    getOffreById(offre_id) {
        return axios.get(`${URL_BACKEND}/api/offres/${offre_id}?populate=*&pagination[limit]=-1`);
    }


}

export default new OffreService();
