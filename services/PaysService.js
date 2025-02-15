import { URL_BACKEND } from 'api';
import axios from 'axios';

const Pays_API_BASE_URL = `${URL_BACKEND}/api/pays?populate=*&pagination[limit]=-1`;

class PaysService {

    getPays() {
        return axios.get(Pays_API_BASE_URL);
    }

    getPaysById(pays_id) {
        return  axios.get(`${URL_BACKEND}/api/pays/${pays_id}?populate=*&pagination[limit]=-1`);
    }


}

export default new PaysService();
