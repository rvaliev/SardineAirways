$(function () {

    // aanmaken van tabs
    $('#inhoud').tabs();

    var moveDay = 0;

    // Datepicker vertrekdatum
    //var vertrekDatum = $('#vertrekdatum');
    $('#vertrekdatum, #checkindatum, #checkoutdatum, #pickupdatum, #dropoffdatum').datepicker({
        dateFormat: "yy-mm-dd",
        minDate: 0,
        maxDate: "+1Y",
        changeMonth: true,  // allow changing month
        changeYear: true,  // allow changing year
        showAnim: 'slideDown', // showing with animation
        showOtherMonths: true, // display dates in other months
        selectOtherMonths: true,
        numberOfMonths: 1 // show multiple months
    });

    $('#vertrekdatum').change(function () {
        //var choosenDate = new Date($(this).val());
        //var now = new Date();
        var choosenDate = getDateDays(new Date($(this).val()));
        var now = getDateDays(new Date());
        moveDay = choosenDate - now;
        destroyTerugDatum(); // destroy terugdatum
        terugDatumLoad(moveDay); // maak opnieuw terugdatum
    });


    var terugDatum = $('#terugdatum');
    terugDatum.parent().hide(); // verbergen van terugvluch datum

    // controle of retour checkbox is checked
    var retour = $('#retour').change(function () {
        if ($(this).is(':checked')){
            terugDatum.parent().show(); // checked
        }
        else{
            terugDatum.parent().hide(); // niet checked
        }
    });








    // ophalen van lijst met alle landen en het opbouwen van een select element
    $.getJSON( "php/ajax_json_countries.php", function( data ) {
        var option = $('<option>').attr('value', "").html("--- Selecteer een land ---");  // creer eerste option
        var select = $('#countries').append(option);  // voeg option in select

        // doorlopen van object en opbouwen van een select lijst
        $.each( data, function( key, val ) {
            var option = $('<option>').attr('value', val.country_code).html(val.country_name);  // creer option
            select.append(option);  // add option to select
        });


        select.change(function () {
            triggerResult($(this));
        });

    });


    // scope: opmaken van eeste option element binnen airports
    {
        var optionAirports = $('<option>').html("--- Selecteer eerst een land ---"); // maak een eerste option
        $('#airports').attr('disabled', 'disabled').append(optionAirports); // voeg option in de airports toe
    }






    // Validatie
    var $foutBoksen = $(".controlbox");
    $('#frmVlucht').validate({
        debug: false,  // when set to 'true' sends message in devtools in case of an error
        rules: {
            vertrekdatum: {   // or vnaam: "required"  ---- vnaam comes from <input id="vnaam">
                required: true,
                dateISO: true
            },
            terugdatum: {
                required: '#retour:checked',
                dateISO: true
            },
            "tickettype": {    // multi select list
                required: true
            }
        },
        messages: {
            vertrekdatum: {
                required: "Vertrekdatum is verplicht",
                dateISO: "Datum moet van formaat JJJJ-MM-DD zijn"
            },
            terugdatum: {
                required: 'U moet nog terugdatum kiezen',
                dateISO: "Datum moet van formaat JJJJ-MM-DD zijn"
            },
            "tickettype": "Kies ticket type"
        },

        errorContainer: $foutBoksen,  // assigning $('div.foutBox') as error container
        errorLabelContainer: $("ul", $foutBoksen),  // choosing ul within $foutBoksen
        wrapper: "li",  // choosing the tag which will wrap the message
        submitHandler: function (form) {  // what to do in case of successfull submit
            form.submit(); // just regular submit, but you can do whatever you want after successfull submit
        }
    });




    // Online check-in
    // Boekingreferentie check: enkel letters en cijfers en max 6 symbolen
    $.validator.addMethod("referentieCheck", function(value, element) {
        return value.match(/^([a-z0-9]){6}$/i);
    });

    var $foutBoksenCheckin = $(".controlboxCheckin");
    $('#frmCheckin').validate({
        debug: true,  // when set to 'true' sends message in devtools in case of an error
        rules: {
            boekingreferentie: {   // or vnaam: "required"  ---- vnaam comes from <input id="vnaam">
                referentieCheck: true
            },
            kredietkaartnummer: {
                required: true,
                creditcard: true
            },
            familienaam: {
                required: true,
                minlength: 2
            }
        },
        messages: {
            boekingreferentie:"Boekingreferentie is verplicht",
            kredietkaartnummer: {
                required: "Verplicht om kredietkaart in te vullen",
                creditcard: "Ongeldige kredietkaart"
            },
            familienaam:{
                required: "Familienaam is verplicht",
                minlength: "Familienaam moet langer dan 2 letters zijn"
            }
        },
        errorContainer: $foutBoksenCheckin,  // assigning $('div.foutBox') as error container
        errorLabelContainer: $("ul", $foutBoksenCheckin),  // choosing ul within $foutBoksen
        wrapper: "li",  // choosing the tag which will wrap the message

        submitHandler: function (form) {  // what to do in case of successfull submit
            form.submit(); // just regular submit, but you can do whatever you want after successfull submit
        }

    });








    // Terugdatum aanmaken
    function terugDatumLoad(minDag){
        // Datepicker terugdatum
        terugDatum.datepicker({
            dateFormat: "yy-mm-dd", // ISO formaat
            minDate: minDag,
            maxDate: "+1Y",
            changeMonth: true,  // allow changing month
            changeYear: true,  // allow changing year
            showAnim: 'slideDown', // showing with animation
            showOtherMonths: true, // display dates in other months
            selectOtherMonths: true,
            numberOfMonths: 1 // show multiple months
        });
    }


    // verwijder terugdatum
    function destroyTerugDatum(){
        terugDatum.datepicker('destroy');
    }

    // bepaal te verplaatsen dagen voor terugdatum
    function getDateDays(epoch){
        return Math.floor(epoch/8.64e7);
    }


    // Dialog venster
    $("#dialoogVenster").dialog({  // setting .dialoogvenster as dialog
        autoOpen: false,
        buttons: {
            "Oke": function(){   // Button name
                $(this).dialog("close");  // close window if "Oke" is pressed
            }
        },
        modal: true,
        width: "auto"
    });


    // meer info icoon
    $('#meerInfo')
        .button({   // styling button
            icons: {
                secondary: 'ui-icon-help'
            }
        })
        .click(function (e) {  // activate dialog window when button was pressed
            e.preventDefault();
            $('#dialoogVenster').dialog("open");  // #dialog_username id of the dialog block
    });











}); // end function










// laad luchtavens op bij het kizen van een land
function triggerResult(land){
    $.getJSON(
        "php/ajax_json_airports.php",
        [
            {
                "name": "country_code",
                "value": land.val()
            }
        ],
        function (json) {
            var airports = $('#airports');
            var option = $('<option>').html("--- Selecteer een luchthaven ---");
            airports.removeAttr('disabled').html('').append(option);

            $.each(json, function (key, val) {
                var option = $('<option>').html(val.airport_name).attr('value', val.airport_code);
                airports.append(option);
            });
        });
}