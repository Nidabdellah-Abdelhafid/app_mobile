import { URL_BACKEND } from 'api';
import axios from 'axios';

const Facture_API_BASE_URL = `${URL_BACKEND}/api/factures?populate=*&pagination[limit]=-1`;

class FactureService {

    // Fetch all factures
    getFacture() {
        return axios.get(Facture_API_BASE_URL);
    }


    // Get a factures by its ID
    getFactureById(facture_id) {
        return axios.get(`${URL_BACKEND}/api/factures/${facture_id}?populate=*&pagination[limit]=-1`);
    }

    addFacture(facture){
        return  axios.post(`${URL_BACKEND}/api/factures`,facture);
    }
    
    updateFacture(facture_id,facture){
        return  axios.put(`${URL_BACKEND}/api/factures/${facture_id}`,facture);
    }

}

export default new FactureService();
