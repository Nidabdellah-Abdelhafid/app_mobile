import { URL_BACKEND } from 'api';
import axios from 'axios';

const Enregetre_API_BASE_URL = `${URL_BACKEND}/api/enregetrers?populate=*&pagination[limit]=-1`;

class EnregetreService {

    // Fetch all badges
    getEnregetre() {
        return axios.get(Enregetre_API_BASE_URL);
    }


    // Get a badges by its ID
    getEnregetreById(badges_id) {
        return axios.get(`${URL_BACKEND}/api/enregetrers/${badges_id}?populate=*&pagination[limit]=-1`);
    }

    addEnregetre(enregetre){
        return  axios.post(`${URL_BACKEND}/api/enregetrers`,enregetre);
    }

    deleteEnregetre(enregetre_id){
        return  axios.delete(`${URL_BACKEND}/api/enregetrers/${enregetre_id}`);
    }


}

export default new EnregetreService();
