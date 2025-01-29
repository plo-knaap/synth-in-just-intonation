function setup() {
	forms = ['triangle', 'sine', 'sawtooth', 'square'];
	formind = 0;
	form = forms[formind];
	createCanvas(2*windowWidth/3, windowHeight);
	
	textAlign(CENTER);
	
	keywidth = 2*windowWidth/30;
	height = 3*windowHeight/4;
	
	frq = [0,0,0,0,0,0,0,0,0,0,0,0];
	
	type = 0;
	types = ['equal tempered', 'just intonation', 'just intonation, first key as base'];
	
	bkeys = [87, 69, 84, 89, 85];								//the black keys, or the row:  w e   t y u
	wkeys = [65, 83, 68, 70, 71, 72, 74, 75];		//the white keys, or the row: a s d f g h j k
	combined = [65, 87, 83, 69, 68, 70, 84, 71, 89, 72, 85, 74, 75];
	
	equal = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.0, 415.3, 440.0, 466.16, 493.88];
	//equal are the equal temeprament tunings starting from c
	
	just = [1, 16/15, 9/8, 6/5, 5/4, 4/3, 64/45, 3/2, 8/5, 5/3, 16/9, 15/8];
	//minor 7th (2nd to last) better as 7/4 or 9/5 (the correct one)? or 16/9?
	
	keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
	
	keyoffset = 0;
	
	firstkey = 0;
	firstkeyind = 0;
	
	key = equal[keyoffset];
	
	frq = [0,0,0,0,0,0,0,0,0,0,0,0];
	for (i = 0; i < 13; i++) {
		frq[i] = key*just[i];
	}
	/*
	attack = createSlider(1, 50, 10);
	attack.position(keywidth, height - 3/2*keywidth);
	attack.style('width',2*keywidth + 'px');
	release = createSlider(1, 50, 10);
	release.position(2*windowWidth/3 - 3*keywidth, height - 3/2*keywidth);
	release.style('width',2*keywidth + 'px');
	*/
	fft = new p5.FFT();
	
	osc0 = new p5.Oscillator();
	osc1 = new p5.Oscillator();
	osc2 = new p5.Oscillator();
	osc3 = new p5.Oscillator();
	osc4 = new p5.Oscillator();
	osc5 = new p5.Oscillator();
	osc6 = new p5.Oscillator();
	osc7 = new p5.Oscillator();
	osc8 = new p5.Oscillator();
	osc9 = new p5.Oscillator();
	osc10 = new p5.Oscillator();
	osc11 = new p5.Oscillator();
	osc12 = new p5.Oscillator();
	
	oscs = [osc0, osc1, osc2, osc3, osc4, osc5, osc6, osc7, osc8, osc9, osc10, osc11, osc12];
	
	for ( i = 0; i < 13; i++) {
		oscs[i].setType(forms[formind]);
		oscs[i].start(); }
}

function draw() {
	background(254, 174, 81);
	rectMode(CENTER);
	
	spectrum = fft.analyze();
	stroke(150, 60, 189);
	noFill();
  for (i = 0; i < spectrum.length/3; i++){
    ellipse(windowWidth/3, windowHeight/2, 3*(spectrum.length - i)*spectrum[i]/spectrum.length, 3*(spectrum.length - i)*spectrum[i]/spectrum.length);
  }
	
	
	for (i = 0; i < 8; i++) {
		stroke(color(0));
		if (keyIsDown(wkeys[i])) {
			fill(249, 161, 46);
		}
		else {
			fill(255);
		}
		rect(keywidth*(3/2 + i), height, keywidth, 2.5*keywidth);
		fill(0);
		noStroke();
		text(char(wkeys[i]), keywidth*(3/2 + i), height);
		
	}
	for (i = 0; i < 5; i++) {
		stroke(color(0));
		if (i > 1) {
			if (keyIsDown(bkeys[i])) {
				fill(249, 161, 46);
			}
			else {
				fill(0);
			}
			rect(keywidth*(6/2 + i), height - 1/2*keywidth, keywidth/2, 3/2*keywidth);
			fill(255);
			noStroke();
			text(char(bkeys[i]), keywidth*(6/2 + i), height - 1/2*keywidth);
			stroke(color(0));
		}
		else {
			if (keyIsDown(bkeys[i])) {
				fill(249, 161, 46);
			}
			else {
				fill(0);
			}
			rect(keywidth*(2 + i), height - 1/2*keywidth, keywidth/2, 3/2*keywidth);
			fill(255);
			noStroke();
			text(char(bkeys[i]), keywidth*(2 + i), height - 1/2*keywidth);
		}
	}
	noStroke();
	text(types[type], windowWidth/3, height - 3/2 * keywidth);
	text(forms[formind], windowWidth/3 + keywidth*3, height - 11/8 * keywidth);
	
	for (i = 0; i < 12; i++) {
		if (type != 0 && i == keyoffset) {
			stroke(254, 174, 81);
			fill(197, 41, 155);
			text(keys[i], windowWidth/3 - keywidth*(11 - 2*i)/8, height - 11/8*keywidth);
		}
		else {
			fill(255);
			text(keys[i], windowWidth/3 - keywidth*(11 - 2*i)/8, height - 11/8*keywidth);
		}
	}
	
	if (type == 0) {
		makeNoise(oscs, combined, equal, keyoffset); }
	else if (type != 0) {
		makeNoise(oscs, combined, frq, keyoffset); }
}

function makeNoise(oscs, combined, freqs, keyoffset) {
	for (i = 0; i < 13; i++) {
		if (keyIsDown(combined[i])) {
			if (i == 12) {
				oscs[i].freq(2*freqs[0]);
				oscs[i].amp(0.5, 0.1);
			}
			else {
				oscs[i].freq(freqs[i]);
				oscs[i].amp(0.5, 0.1);
			}
		}
		else {
			oscs[i].amp(0, 0.1);
		}
	}
}

function keyPressed() {
	if (keyCode == 32) {
		if (type < 2) {
			type++;
		}
		else {
			type = 0;
		}
	}
	if (keyCode == LEFT_ARROW && type == 1) {
		if (keyoffset == 0) {
			keyoffset = 11; }
		else {
			keyoffset--; }
	}
	else if (keyCode == RIGHT_ARROW && type == 1) {
		if (keyoffset == 11) {
			keyoffset = 0; }
		else {
			keyoffset++; }
	}
	if (type == 2) {
		for (i = 0; i < combined.length; i++) {
			if (keyIsDown(combined[i])) {
				firstkey++;
				firstkeyind = i;
			}
		}
		if (firstkey == 1) {
			keyoffset = firstkeyind;
		}
		firstkey = 0;
		firstkeyind = 0;
	}
	if (keyCode == UP_ARROW) {
		if (formind == 3) {
			formind = 0; }
		else {
			formind++; }
		for ( i = 0; i < 13; i++) {
			oscs[i].setType(forms[formind]); }
	}
	else if (keyCode == DOWN_ARROW) {
		if (formind == 0) {
			formind = 3; }
		else {
			formind--; }
		for ( i = 0; i < 13; i++) {
			oscs[i].setType(forms[formind]); }
	}
		
	key = equal[keyoffset];
	
	for (i = 0; i < 12; i++) {
		if (i + keyoffset < 12) {
			frq[i + keyoffset] = key*just[i];
		}
		else {
			frq[i + keyoffset - 12] = key*just[i]/2;
		}
	}
	return false;
}
