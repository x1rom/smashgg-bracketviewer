var token = '';

const api = "https://api.smash.gg/gql/alpha";
$(function(){
    //initialisation
    $('#tournamentInfoTab').addClass("active");
    $('#appearanceTab').removeClass("active");

    $('#tournamentInfoContainer').show();
    $('#appearanceContainer').hide();


    //Tournament Info Tab
    $('#tournamentInfoTab').on("click", function(){
        $('#tournamentInfoTab').addClass("active");
        $('#appearanceTab').removeClass("active");

        $('#tournamentInfoContainer').show();
        $('#appearanceContainer').hide();
    });
    //Appearance Tab
    $('#appearanceTab').on("click", function(){
        $('#tournamentInfoTab').removeClass("active");
        $('#appearanceTab').addClass("active");

        $('#tournamentInfoContainer').hide();
        $('#appearanceContainer').show();
    });
    
    //enter API token
    $('#APIToken').on('change', function(){
        token = $('#APIToken').val();

    });

    //enter Tournament Slug
    $('#tournamentSlug').on('change', function(){
        if(token != ''){
            var APIquery = 'query TournamentQuery($slug:String){tournament(slug: $slug){events{name, id}}}';
            var APIvariables = '{"slug": "' + $('#tournamentSlug').val() + '"}';
            $.ajax({
                type: 'POST',
                url: api,
                dataType: 'application/json',
                headers: {Authorization: "Bearer " + token},
                data: {query: APIquery, variables: APIvariables}
            }).always(function(data){
                response = JSON.parse(data.responseText);
                if(response.data.tournament == null){
                    $('#eventSelectorButton').addClass("disabled");
                    $('#eventSelectorButton').removeClass("enabled");
                }else{
                    $('#eventSelectorButton').addClass("enabled");
                    $('#eventSelectorButton').removeClass("disabled");
                    $('#eventList').empty();
                    var events = response.data.tournament.events;
                    events.forEach(event => {
                        $('#eventList').append('<li><button class="dropdown-item">' + event.name + ' (event id: ' + event.id + ')</button></li>');
                    });
                    handleEventButtons();
                }
            })
        }
    });
     
});

function handleEventButtons(){
    $('#eventList').find('button').each(function(){
        this.addEventListener('click', function(){

            $('#eventSelectorButton').text($(this).text());
        });
    });
}