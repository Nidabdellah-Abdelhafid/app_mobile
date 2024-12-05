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
        return  fetch(`${URL_BACKEND}/api/pays/${pays_id}?populate=*&pagination[limit]=-1`);
    }


}

export default new PaysService();
