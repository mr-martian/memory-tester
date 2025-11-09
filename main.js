function clean_text(input) {
    const letter = /(\p{L}+)(\p{M}*)/dgu;
    let s = input.normalize('NFD');
    let ret = [];
    let cur = '';
    let cur_check = '';
    let last_index = 0;
    for (let x of s.matchAll(letter)) {
	if (x.indices[0][0] > last_index) {
	    ret.push({display: cur, check: cur_check,
		      space: s.slice(last_index, x.indices[0][0])});
	    cur = '';
	    cur_check = '';
	}
	last_index = x.indices[0][1];
	cur += x[1] + x[2];
	cur_check += x[1];
    }
    ret.push({display: cur, check: cur_check,
	      space: s.slice(last_index)});
    return ret
}

function clean_check(input) {
    const letter = /\p{L}+/gu;
    return Array.from(input.normalize('NFD').matchAll(letter)).map(
	(s) => s[0]).join('');
}

CUR_TEXT = [];

function check_word(input) {
    let cur_index = parseInt($('#display').data('index'));
    let elem = document.getElementById('display');
    if (cur_index >= CUR_TEXT.length) {
	return;
    }
    let ct = CUR_TEXT[cur_index];
    $('#display').data('index', cur_index+1);
    if (!ct.check) {
	elem.innerHTML += ct.space;
	check_word(input);
	return;
    }
    if (ct.check == clean_check(input)) {
	elem.innerHTML += '<span class="correct">'+ct.display+'</span>';
    } else {
	elem.innerHTML += '<del>'+input+'</del><ins>'+ct.display+'</ins>';
    }
    elem.innerHTML += ct.space;
}

$(function() {
    $('#input').bind('keypress', function(e) {
	CUR_TEXT = clean_text(e.target.value);
	$('#display').html('').data('index', '0');
	e.target.value = '';
	$('#check').focus();
    });
    $('#check').bind('keypress', function(e) {
	if (e.originalEvent.charCode == 0 || e.originalEvent.charCode == 32 || e.originalEvent.key == 'Enter') {
	    e.preventDefault();
	    check_word(e.target.value);
	    e.target.value = '';
	}
    });
});
