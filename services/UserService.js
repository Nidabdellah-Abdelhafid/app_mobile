import { URL_BACKEND } from 'api';
import axios from 'axios';

const User_API_BASE_URL = `${URL_BACKEND}/api/users?populate=*&pagination[limit]=-1`;

class UserService {

    // Fetch all users
    getUser() {
        return axios.get(User_API_BASE_URL);
        
    }

    // Get a users by its ID
    getUserById(users_id) {
        return axios.get(`${URL_BACKEND}/api/users/${users_id}?populate=*&pagination[limit]=-1`);
    }

}

export default new UserService();
