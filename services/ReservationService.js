import { URL_BACKEND } from 'api';
import axios from 'axios';

const Reservation_API_BASE_URL = `${URL_BACKEND}/api/reservations?populate=*&pagination[limit]=-1`;

class ReservationService {

    // Fetch all reservations
    getReservation() {
        return axios.get(Reservation_API_BASE_URL);
    }


    // Get a reservations by its ID
    getReservationById(reservations_id) {
        return axios.get(`${URL_BACKEND}/api/reservations/${reservations_id}?populate=*&pagination[limit]=-1`);
    }

    addReservation(reservation){
        return  axios.post(`${URL_BACKEND}/api/reservations`, reservation);
    }
    
    updateReservation(restaurant_id,reservation){
        return  axios.put(`${URL_BACKEND}/api/reservations/${restaurant_id}`, reservation);
        
    }
}

export default new ReservationService();
