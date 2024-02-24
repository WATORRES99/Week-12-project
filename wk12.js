class Team {
    constructor(name){
        this.name = name;
        this.players = [];
    }
    
    addPlayer(name, position){
        this.players.push(new Player(name, position));
    }
}


class Player {
    constructor(name, position){
        this.name = name;
        this.position = position;
    }                               
}

class TeamManagement {
    static url = 'https://65d8e84cc96fbb24c1bc7f11.mockapi.io/api/Teams/football';

    static getAllTeams(){
        return $.get(this.url);
    }
 
    static getTeam(id){
        return $.get(this.url + `/${id}`); 
    }
    
    static createTeam(team){
        return $.post(this.url, team); 
    }
    static updateTeam(team){
        return $.ajax({
         url: this.url + `/${team._id}`,
         dataType: `json`,
         data: JSON.stringify(team),
         contentType: `application/json`,
         type: 'PUT'
        });
    }
    static deleteTeam(id){
        return $.ajax({
            url: `${this.url}/${parseInt(id.id)}`,
            type: `DELETE`
        });

        
    }

}

class DOMManager{
    static team;

    static getAllTeams(){
        TeamManagement.getAllTeams().then(teams => this.render(teams));
    }

    static createTeam(name){
        TeamManagement.createTeam(new Team(name))
            .then(() => {
                return TeamManagement.getAllTeams();
            })
            .then((teams) => this.render(teams));
    }

    static deleteTeam(id){
        TeamManagement.deleteTeam(id)
            .then(() => {
                return TeamManagement.getAllTeams();
            })
            .then((teams) => this.render(teams));
    }

    static addPlayer(id){
        for (let team of this.teams){
            if(team._id == id){
                team.players.push(new Position($(`#${team._id}-player-name`).val(), $(`#${team._id}-player-position`).val()));
                TeamManagement.updateTeam(team)
                    .then(() => {
                        return TeamManagement.getAllTeams();
                    })
                    .then((teams) => this.render(teams));
                
            }
        }
    }

    static deletePlayer(teamId, playerId){
        for( let team of this.teams){
            if(team._id == teamId){
                for(let player of team.players){
                    if(player._id == playerId){
                        team.players.splice(team.players.indexOf(player), 1);
                        TeamManagement.updateTeam(team)
                        .then(() => {
                            return TeamManagement.getAllTeams();
                        })
                        .then((teams) => this.render(teams));
                    }
                }


            }
        }
    }

    static render(teams){
        this.teams = teams;
        $('#app').empty();
        for(let team of teams){
            $('#app').prepend(
                `<div id="${team._id}" class="card">
                     <div class="card-header">
                         <h2>${team.name}</h2>
                         <button class="btn btn-danger" onclick="DOMManager.deleteTeam('${team._id}')">Delete</button>
                     </div>
                     <div class="card-body">
                         <div class="card">
                             <div class= "row">
                                 <div class="col-sm">
                                    <input type="text" id="${team._id}-player-name" class ="form-control" placeholder= "Player Name">

                            </div>
                                <div class="col-sm">
                                    <input type="text" id="${team._id}-player-position" class ="form-control" placeholder= "Position">
                                </div>
                            </div>
                            <button id="${team._id}-new-player" onclick="DOMManager.addPlayer('${team._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>
                 `
            );
            for (let player of team.players) {
                $(`#${team._id}`).find('.card-body').append(
                    `<p>
                    <span id="name-${player._id}"><strong>Name: </strong> ${player.name}</span>
                    <span id="position-${player._id}"><strong>Position: </strong> ${player.name}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deletePlayer('${team._id}', '${player._id}')">Delete Player</button>`
                );

            }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
        }
    }
}

$(`#create-new-football-fantasy`).click(( )=> {
    DOMManager.createTeam($(`#new-football-fantasy-name`).val());
    $(`new-football-fantasy-name`).val('');

})

DOMManager.getAllTeams();


