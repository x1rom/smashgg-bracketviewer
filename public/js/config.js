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
            let APIquery = 'query TournamentQuery($slug:String){tournament(slug: $slug){events{name, id}}}';
            let APIvariables = '{"slug": "' + $('#tournamentSlug').val() + '"}';
            APIReqest(APIToken, APIquery, APIvariables, function(response){
                let events = response.data.tournament.events;
                localStorage.setItem("events", JSON.stringify(events));
                handleEventButtons(events);
            });
        }
        localStorage.setItem("slug", $('#tournamentSlug').val());
    });
    slug = localStorage.getItem("slug");
    $('#tournamentSlug').val(slug);

    let events = JSON.parse(localStorage.getItem("events"));
    handleEventButtons(events);
    let phases = JSON.parse(localStorage.getItem("phases"));
    handlePhaseButtons(phases);
});

function handleEventButtons(events){
    if(events != null){
        $('#eventSelectorButton').addClass("enabled");
        $('#eventSelectorButton').removeClass("disabled");
    }else{
        $('#eventSelectorButton').addClass("disabled");
        $('#eventSelectorButton').removeClass("enabled");
    }
    let selectedEvent = localStorage.getItem("eventSelector");
    if(selectedEvent != null) {
        $('#eventSelectorButton').text(selectedEvent);
    }
    $('#eventList').empty();
    events.forEach(event => {
        $('#eventList').append('<li><button class="dropdown-item">' + event.name + ' (event id: ' + event.id + ')</button></li>');
    });
    $('#eventList').find('button').each(function(){
        this.addEventListener('click', function(){
            let eventText = $(this).text();
            $('#eventSelectorButton').text(eventText);
            localStorage.setItem("eventSelector", eventText);

            let APIquery = 'query PhaseQuery($eventId: ID){event(id: $eventId){phases {name,id}}}';
            let eventId = eventText.substring(eventText.search('\(event id: \d*\)')+10, eventText.length-1);
            let APIvariables = '{"eventId": ' + eventId + '}';
            APIReqest(APIToken, APIquery, APIvariables, function(response){
                let phases = response.data.event.phases;
                localStorage.setItem("phases", JSON.stringify(phases));
                handlePhaseButtons(phases);
            })
        });
    });
}

function handlePhaseButtons(phases){
    if(phases != null) {
        $('#phaseSelectorButton').addClass("enabled");
        $('#phaseSelectorButton').removeClass("disabled");
    }else{
        $('#phaseSelectorButton').addClass("disabled");
        $('#phaseSelectorButton').removeClass("enabled");
    }
    let selectedPhase = localStorage.getItem("phaseSelector");
    if(selectedPhase != null) {
        $('#phaseSelectorButton').text(selectedPhase);
    }
    $('#phaseList').empty();
    phases.forEach(phase => {
        $('#phaseList').append('<li><button class="dropdown-item">' + phase.name + ' (phase id: ' + phase.id + ')</button></li>');
    });
    $('#phaseList').find('button').each(function(){
        this.addEventListener('click', function(){
            $('#phaseSelectorButton').text($(this).text());
            localStorage.setItem("phaseSelector", $(this).text());
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