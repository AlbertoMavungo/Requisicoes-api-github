document.getElementById('btn-search').addEventListener('click', () => {
    const userName = document.getElementById('input-search').value
    getUserProfile(userName)
})

document.getElementById('input-search').addEventListener('keyup', (e) => {
    const userName = e.target.value
    const key = e.which || e.keyCode
    const isEnterKeyPressed = key === 13

    if (isEnterKeyPressed) {
        getUserProfile(userName)
    }
})

async function userDataGeneral(userName) {
    const response = await fetch(`https://api.github.com/users/${userName}`)
    return await response.json()
}

async function repos(userName) {
    const response = await fetch(`https://api.github.com/users/${userName}/repos?per_page=10`)
    return await response.json()
}

async function events(userName) {
    const response = await fetch(`https://api.github.com/users/${userName}/events?per_page=10`)
    return await response.json()
}
events()

async function getUserProfile(userName) {
    userDataGeneral(userName).then((userData) => {

        let userInfo = `<div class="info">
                            <img src="${userData.avatar_url}" alt="Foto do perfil do usuário"/>
                            <div class="data">
                                <h1>${userData.name ?? 'Não possui nome cadastrado 😥'}</h1>
                                <p>${userData.bio ?? 'Não possui bio cadastrada 😥'}</p>
                            </div>
                        </div>`

        document.querySelector('.profile-data').innerHTML = userInfo;
        getfolloresAndFollowing(userName)
        getUserRepositories(userName)
        getEvents(userName)
    })
}

const getfolloresAndFollowing = userName => {
    userDataGeneral(userName).then(followsData => {
        let follows = followsData
        document.querySelector('.profile-data').innerHTML += `<div class="follow">
                                                                 <div class="following">                                               
                                                                     <h4>🫂Seguindo</h4>
                                                                     <h4>${follows.following}</h4>
                                                                 </div> 
                                                                 <span>
                                                                     <div> 
                                                                         <h4>🫂Seguidores</h4>
                                                                         <h4>${follows.followers}</h4> 
                                                                     <div>
                                                                 </span>
                                                         </div>`
    });
}

function getUserRepositories(userName) {
    repos(userName).then(reposData => {
        let repositoriesItens = ""

        reposData.forEach(repo => {
            repositoriesItens += `<li class='infos-repo'>
                                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                                    <div>
                                        <ul class='info-repos-plus'>
                                            <li> 🍴${repo.forks}</li>
                                            <li> 👀${repo.watchers}</li>
                                            <li> 👅${repo.language}</li>
                                            <li> ⭐${repo.stargazers_count}</li>
                                        </ul>
                                    </div>
                                </li>`
        });

        document.querySelector('.profile-data').innerHTML += `<div class="repositories section">
                                                                <h2>Repositorios</h2>
                                                                <ul>${repositoriesItens}</ul>
                                                            </div>`
    })
}

const getEvents = (userName) => {
    events(userName).then(eventsDatas => {
        let eventsItens = ""
        eventsDatas.forEach(event => {
            if (event.type === 'CreateEvent' || event.type === 'PushEvent') {
                eventsItens += `<li class="events">${event.repo.name} - ${event.type}</li>`
            }
    
        })
        document.querySelector('.profile-data').innerHTML += `<div>
                                                                <h2>Eventos</h2>
                                                                <ul>${eventsItens}</ul>
                                                            </div>`
                                                            
    })
}

