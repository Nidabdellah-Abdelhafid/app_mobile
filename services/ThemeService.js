import { URL_BACKEND } from 'api';
import axios from 'axios';

const Theme_API_BASE_URL = `${URL_BACKEND}/api/themes?populate=*&pagination[limit]=-1`;

class ThemeService {

    // Fetch all theme
    getTheme() {
        return axios.get(Theme_API_BASE_URL);
    }


    // Get a theme by its ID
    getThemeById(theme_id) {
        return axios.get(`${URL_BACKEND}/api/themes/${theme_id}?populate=*&pagination[limit]=-1`);
    }


}

export default new ThemeService();
