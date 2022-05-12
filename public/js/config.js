const api = "https://api.smash.gg/gql/alpha";

var APIToken = '';
var slug = '';
var eventID = '';

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
        localStorage.setItem("APIToken", $('#APIToken').val());
    });
    APIToken = localStorage.getItem("APIToken");
    $('#APIToken').val(APIToken);

    //enter Tournament Slug
    $('#tournamentSlug').on('change', function(){
        if(APIToken != ''){
            var APIquery = 'query TournamentQuery($slug:String){tournament(slug: $slug){events{name, id}}}';
            var APIvariables = '{"slug": "' + $('#tournamentSlug').val() + '"}';
            APIReqest(APIToken, APIquery, APIvariables, function(response){
                if(response.data.tournament == null){
                    $('#eventSelectorButton').addClass("disabled");
                    $('#eventSelectorButton').removeClass("enabled");
                }else{
                    $('#eventSelectorButton').addClass("enabled");
                    $('#eventSelectorButton').removeClass("disabled");
                    var events = response.data.tournament.events;
                    localStorage.setItem("events", JSON.stringify(events));
                    handleEventButtons(events);
                }
            });
        }
        localStorage.setItem("slug", $('#tournamentSlug').val());
    });
    slug = localStorage.getItem("slug");
    $('#tournamentSlug').val(slug);

    var events = JSON.parse(localStorage.getItem("events"));
    if(events != null){
        $('#eventSelectorButton').addClass("enabled");
        $('#eventSelectorButton').removeClass("disabled");
    }
    handleEventButtons(events);
    
});

function handleEventButtons(events){
    $('#eventList').empty();
    events.forEach(event => {
        $('#eventList').append('<li><button class="dropdown-item">' + event.name + ' (event id: ' + event.id + ')</button></li>');
    });
    $('#eventList').find('button').each(function(){
        this.addEventListener('click', function(){
            $('#eventSelectorButton').text($(this).text());
            
        });
    });
}

function APIReqest(token, query, vars, func){
    $.ajax({
        type: 'POST',
        url: api,
        dataType: 'application/json',
        headers: {Authorization: "Bearer " + token},
        data: {query: query, variables: vars}
    }).always(function(data){
        func(JSON.parse(data.responseText));
    })
}