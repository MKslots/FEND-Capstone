
import { handleAPIData } from './js/application.js'

// Event Handler

document.getElementById('submit').addEventListener('click', () => {
    event.preventDefault(); 
    const location = document.getElementById('location').value;
    const date = document.getElementById('travelDate').value;

    if(location.trim() == '' || date ==''){
        alert(`Please enter valid location`)
    }
    else {
    handleAPIData(location);
    }
});

import './styles/style.scss'
import './styles/header.scss'
import './styles/footer.scss'

export {
    handleAPIData
}





