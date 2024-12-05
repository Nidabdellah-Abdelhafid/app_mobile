import { URL_BACKEND } from 'api';
import axios from 'axios';

const Message_API_BASE_URL = `${URL_BACKEND}/api/messages?populate=*&pagination[limit]=-1`;

class MessageService {

    // Fetch all messages
    getMessage() {
        return axios.get(Message_API_BASE_URL);
    }


    // Get a messages by its ID
    getMessageById(messages_id) {
        return axios.get(`${URL_BACKEND}/api/messages/${messages_id}?populate=*&pagination[limit]=-1`);
    }

    addMessage(message){
        return  axios.post(`${URL_BACKEND}/api/messages`,message, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    deleteMessage(message_id){
        return  axios.delete(`${URL_BACKEND}/api/messages/${message_id}`);
    }

}

export default new MessageService();
