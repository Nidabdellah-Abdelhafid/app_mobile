import { URL_BACKEND } from 'api';
import axios from 'axios';

const Programme_API_BASE_URL = `${URL_BACKEND}/api/programmes?populate=*&pagination[limit]=-1`;

class ProgrammeService {

    // Fetch all programmes
    getProgramme() {
        return axios.get(Programme_API_BASE_URL);
    }


    // Get a programmes by its ID
    getProgrammeById(programmes_id) {
        return axios.get(`${URL_BACKEND}/api/programmes/${programmes_id}?populate=*&pagination[limit]=-1`);
    }


}

export default new ProgrammeService();
