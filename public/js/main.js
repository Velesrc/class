// When User Typing in Input field for Time, function checks if time is valid
function CheckInput(name) {
const RegExpForTime = /^(10|11|12|[1-9]):[0-5][0-9]$/;
   // alert(id_name);
   $(`#${name}`).parent().addClass('time_change');
    if( $(`#${name}`).val != false )
    {
        
        let inputText = $(`#${name}`).val();
        if(inputText.match(RegExpForTime) != null)
        {
            $(`#${name}`).removeClass('is-invalid');
            $(`#${name}`).addClass('is-valid');
        }
        else
        {
            $(`#${name}`).addClass('is-invalid');
        }
    } 
}

