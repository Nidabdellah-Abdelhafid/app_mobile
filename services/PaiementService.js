import { URL_BACKEND } from 'api';
import axios from 'axios';

const Paiement_API_BASE_URL = `${URL_BACKEND}/api/paiements?populate=*&pagination[limit]=-1`;

class PaiementService {

    // Fetch all Paiements
    getPaiement() {
        return axios.get(Paiement_API_BASE_URL);
    }


    // Get a Paiements by its ID
    getPaiementById(paiements_id) {
        return axios.get(`${URL_BACKEND}/api/paiements/${paiements_id}?populate=*&pagination[limit]=-1`);
    }

    addPaiement(paiement){
        return  axios.post(`${URL_BACKEND}/api/paiements`,paiement);
    }
    
    updatePaiement(restaurant_id,photo){
        return  axios.put(`http://localhost:2026/Vill_Zone/restaurant/${restaurant_id}/updatePaiement/`+photo_id,photo);
    }

}

export default new PaiementService();
