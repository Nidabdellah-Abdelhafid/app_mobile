import { URL_BACKEND } from 'api';
import axios from 'axios';

const Favorie_API_BASE_URL = `${URL_BACKEND}/api/favories?populate=*&pagination[limit]=-1`;

class FavorieService {

    // Fetch all favories
    getFavorie() {
        return axios.get(Favorie_API_BASE_URL);
    }


    // Get a favories by its ID
    getFavorieById(favories_id) {
        return axios.get(`${URL_BACKEND}/api/favories/${favories_id}?populate=*&pagination[limit]=-1`);
    }

    addFavorie(favorie){
        return  axios.post(`${URL_BACKEND}/api/favories`,favorie);
    }

    deleteFavorie(favorie_id){
        return  axios.delete(`${URL_BACKEND}/api/favories/${favorie_id}`);
    }

}

export default new FavorieService();
