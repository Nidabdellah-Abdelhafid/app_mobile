import { URL_BACKEND } from 'api';
import axios from 'axios';

const Badge_API_BASE_URL = `${URL_BACKEND}/api/badges?populate=*&pagination[limit]=-1`;

class BadgeService {

    // Fetch all badges
    getBadge() {
        return axios.get(Badge_API_BASE_URL);
    }


    // Get a badges by its ID
    getBadgeById(badges_id) {
        return axios.get(`${URL_BACKEND}/api/badges/${badges_id}?populate=*&pagination[limit]=-1`);
    }
}

export default new BadgeService();