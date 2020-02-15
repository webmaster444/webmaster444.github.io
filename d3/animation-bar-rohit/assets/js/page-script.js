$(document).ready(function(){
	$('.settings-block h2').click(function(){
		$(this).parent().toggleClass('open');
	})

	$("#visualisation-tabs button").click(function(){
		$("#visualisation-tabs button").removeClass('active');
		$(this).addClass('active');
		$('.tab-pane').removeClass('active');
		if($(this).val()=="preview"){
			$('.tab-pane.tab-preview').addClass('active');
		}else if($(this).val()=="data"){
			$('.tab-pane.tab-data').addClass('active');
		}
	})
})