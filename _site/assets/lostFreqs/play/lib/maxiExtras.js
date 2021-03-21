

var maximEx = (function () {

	var mx = {};

///////////////////////////HELPERS////////////////////////////////

  function linlin(input, i_min, i_max, o_min, o_max)
  {
    var i_range = Math.abs(i_max - i_min);
    var norm = (input - i_min)/i_range;
    //reversing if min and max are otherway round
    if(i_min > i_max){
      norm = 1.0 - norm;
    }
    if(o_min > o_max)
    {
      norm = 1.0 - norm;
    }
    var o_range = Math.abs(o_max - o_min);
    var out = norm * o_range + Math.min(o_min, o_max);
    return out;
  }

  function linexp(input, i_min, i_max, o_min, o_max, exp)
  {
    var i_range = Math.abs(i_max - i_min);
    var norm = (input - i_min)/i_range;

    if(i_min > i_max){
      norm = 1.0 - norm;
    }
    if(o_min > o_max)
    {
      norm = 1.0 - norm;
    }

    var o_range = Math.abs(o_max - o_min);
    var out = Math.pow(norm,exp) * o_range + Math.min(o_min, o_max);
    return out;
  }

  mx.env = function()
  {

    var phase = 0;
    var isTriggered = false;
    var env_idx;
    var isAttack = true;

    this.trigger = function ()
    {
  		phase = 0;
      env_idx = 0;
      isTriggered = true;
      isAttack = true;
  	}

    this.reset = function ()
    {
      isTriggered = false;
    }

    this.release = function()
    {
      isAttack = false;
    }

    this.line = function(start_val, end_val, duration)
    {
      if(!isTriggered)
      {
        return start_val;
      }
      phase += 1/(44100 * duration);
      phase = Math.min(1.0, phase);
      return linlin(phase, 0.0, 1.0, start_val, end_val);
    }

    this.xLine = function(start_val, end_val, duration)
    {
      if(!isTriggered)
      {
        return start_val;
      }
      else
      {
        phase += 1/(44100 * duration);
        phase = Math.min(1.0, phase);
        return linexp(phase, 0.0, 1.0, start_val, end_val, 2.0);
      }

    }

    this.customLine = function(durations, values)
    {

      //durations needs to have one less item than values
      //TODO error handling here

      if(!isTriggered)
      {
        return values[0];
      }
      else
      {
        if(phase >= 1)
        {
          if(env_idx < durations.length - 1)
          {
            env_idx += 1; //move to the next segment
            phase = 0;
          }
        }
        else
        {
          phase += 1/(44100 * durations[env_idx]);
        }

        return linlin(phase, 0.0, 1.0, values[env_idx], values[env_idx+1]);
      }

    }

    this.ar = function(attackTime, releaseTime)
    {
      if(!isTriggered)
      {
        return 0;
      }
      else if(isAttack)
      {
        phase += 1/(44100 * attackTime);
        if(phase >= 1.0)
        {
          isAttack = false;
        }
        return linexp(phase, 0.0, 1.0, 0.0, 1.0, 0.5); //tweaked for percussive envelope
      }
      else
      {
        if(phase <= 0)
        {
          return 0;
        }
        else
        {
          phase -= 1/(44100 * releaseTime);
          return linexp(phase, 0.0, 1.0, 0.0, 1.0, 2.0); //tweaked for percussive envelope
        }
      }

    }

    this.asr = function(attackTime, releaseTime)
    {
      if(!isTriggered)
      {
        return 0;
      }
      else if(isAttack)
      {
        if(phase < 1.0)
        {
          phase += 1/(44100 * attackTime);
        }
        return linexp(phase, 0.0, 1.0, 0.0, 1.0, 0.5);
      }
      else
      {
        if(phase <= 0)
        {
          return 0;
        }
        else
        {
          phase -= 1/(44100 * releaseTime);
          return linexp(phase, 0.0, 1.0, 0.0, 1.0, 2.0);
        }
      }

    }

    //I could make an adsr but maximJs already has a working one

  }

  mx.filter = function()
  {

		var inputHist = [0,0 ,0];
		var outputHist = [0,0,0];
    var c, a1, a2, a3, b1, b2 ,b3, alpha, q;
		var res = Math.sqrt(2.0); // max == sqrt(2)
    var sampleRate = 44100.0;
		var cutoff = -1;
		var count = 0;

		function process(signal)
		{
			var newOutput = a1 * signal +
			a2 * inputHist[0] +
			a3 * inputHist[1] -
			b1 * outputHist[0] -
			b2 * outputHist[1];

			//shuffling values along
			inputHist[1] = inputHist[0];
			inputHist[0] = signal;

			outputHist[2] = outputHist[1];
			outputHist[1] = outputHist[0];
			outputHist[0] = newOutput;

			return newOutput;
		}


    this.lowpass = function(input, _cutoff)
    {
			//butterworth apparently

			if(cutoff != _cutoff)
			{
				cutoff = _cutoff;
				//only recalculate for a new cutoff
				c = 1.0 / Math.tan(Math.PI * cutoff / sampleRate);
				a1 = 1.0 / (1.0 + res * c + c * c);
				a2 = 2.0 * a1;
				a3 = a1;
				b1 = 2.0 * (1.0 - c * c) * a1;
				b2 = (1.0 - res * c + c * c) * a1;
			}

			return process(input);

    }

    this.highpass = function(input, _cutoff)
    {

			if(cutoff !=  _cutoff)
			{
				cutoff = _cutoff;
				c = Math.tan(Math.PI * cutoff/ sampleRate);
				a1 = 1.0 / (1.0 + res * c + c * c);
				a2 = -2 * a1;
				a3 = a1;
				b1 = 2.0 * (c * c - 1.0) * a1;
				b2 = (1.0 - res * c + c * c) * a1;
			}

			return process(input);

    }

    this.bandpass = function(input, _cutoff, _q)
    {

			//from here http://www.musicdsp.org/files/Audio-EQ-Cookbook.txt

			if(cutoff !=  _cutoff || q != _q)
			{

				q = _q;
				cutoff = _cutoff;
				c = 2 * Math.PI * cutoff/44100;
				alpha = Math.sin(c)/(2 * q);

				b1 =   alpha;
				b2 =   0;
				b3 =  -1 * alpha;
				a1 =   1 + alpha;
				a2 =  -2 * Math.cos(c);
				a3 =   1 - alpha;

			}

			inputHist[2] = input;

			outputHist[2] = (b1/a1) * inputHist[2] +
			(b2/a1) * inputHist[1] +
			(b3/a1) * inputHist[0] -
			(a2/a1) * outputHist[1] -
			(a3/a1) * outputHist[0];

			var out = outputHist[2];

			outputHist[0] = outputHist[1]; outputHist[1] = outputHist[2];
			inputHist[0] = inputHist[1]; inputHist[1] = inputHist[2];

			return out;

    }

  }

	return mx;

}());



/* For the students to make */

//OnePoleFilter ... perhaps something else too



//WhiteNoise



//BrownNoise
