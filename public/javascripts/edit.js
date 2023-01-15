window.onload = function(){
    let sumbit = document.getElementById('amaitu')
    console.log('submit')
    sumbit.addEventListener('click', async (event)=>{
        event.preventDefault()
        let player = {
            id: document.getElementsByName('id')[0].value,
            name : document.getElementsByName('name')[0].value,
            birthdate : document.getElementsByName('birthdate')[0].value,
            nationality : document.getElementsByName('nationality')[0].value,
            teamId : document.getElementsByName('teamid')[0].value,
            position : document.getElementsByName('position')[0].value,
            number : document.getElementsByName('number')[0].value,
            leagueId : document.getElementsByName('leagueid')[0].value
        }
        console.log(player)
        fetch(`/api/v1/players/edit/${player.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(player)
        }).then(r=> r.text()).then(r=> document.write(r))
        
    })
}