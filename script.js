async function getSteamGameID(gameName) {
    const url = 'https://api.steampowered.com/ISteamApps/GetAppList/v2/';
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        const app = data.applist.apps.find(app => app.name.toLowerCase() === gameName.toLowerCase());

        if (app) {
            return app.appid;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la liste des jeux Steam :', error);
        return null;
    }
}

function getSteamLink() {
    console.log("Getting the game's steam ID\n---");

    let gameNameElement = document.getElementById("title");
    let gameName = gameNameElement.getElementsByClassName("mb-0")[0].textContent.trim();
    
    console.log("Game's name-", gameName);
    
    return new Promise((resolve, reject) => {
        getSteamGameID(gameName).then(gameID => {
            if (gameID) {
                let steamLink = `https://store.steampowered.com/app/${gameID}/`;
                console.log(`Game's ID - ${gameID}`);
                resolve(steamLink);
            } else {
                console.log(`The game '${gameName}' wasn't found in the Steam database.`);
                reject(`The game '${gameName}' wasn't found`);
            }
        }).catch(error => {
            console.error('Error while trying to get the game\'s ID :', error);
            reject(error);
        });
    });
}

function addSteamLink(link) {
    console.log("Adding the link to the page.\n");
    let elements = document.getElementsByClassName("col-lg-4 mt-1 mt-lg-2 col-12");
    let subelement = null;

    for (let i = 0; i < elements.length; i++) {
        let subelements = elements[i].getElementsByClassName("col-auto");
        if (subelements.length > 0) {
            subelement = subelements[0];
            break; 
        }
    }

    if (subelement !== null) {
        let subtitleElement = subelement.querySelector('p.mb-0.subtitle-text');

        let anchor = document.createElement('a');
        anchor.href = encodeURI(link); 
        anchor.target = "_blank";
        anchor.innerHTML = 'Steam ';
    
        let img = document.createElement('img');
        img.src = "https://store.steampowered.com/favicon.ico";
        img.width = 20;
        anchor.appendChild(img);
    
        let textNode = document.createTextNode(' and ');

        subtitleElement.appendChild(textNode);
        subtitleElement.appendChild(anchor);
    }
}

getSteamLink().then(steamLink => {
    console.log('Steam link - ', steamLink);
    addSteamLink(steamLink);	
}).catch(error => {
    console.error('Error while trying to get the steam link :', error);
});