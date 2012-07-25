var img = {
  sample1: 'img/sample1.gif',
  sample2: 'img/sample2.gif',
  sample3: 'img/sample3.gif',
  sample4: 'img/sample4.gif',
  sample5: 'img/sample5.gif',
  sample6: 'img/sample6.gif',
  sample7: 'img/sample7.gif',
  sample8: 'img/sample8.gif',
  sample9: 'img/sample9.gif',
  sample10: 'img/sample10.gif',
  sample11: 'img/sample11.gif',
  sample12: 'img/sample12.gif',
  sample13: 'img/sample13.gif',
  sample14: 'img/sample14.gif'
};

var scenario = [
  function (){
    this.act({
      img: img.sample1,
      outEffect: 'BlindUp',
      inEffect: 'Appear',
      filter: '',
      msg: "theater.js�T���v��(��{��)�ł��B��ʂ��N���b�N���邽�тɃV�i���I���i�s���܂��B<br/>"
      + "(Enter�L�[�A�܂��̓X�y�[�X�L�[�ł��i�s���܂��B)"
    });
  },
  function (){
    this.act({
      img: img.sample2,
      msg: "���̂��т�theater.js���_�E�����[�h���Ă��������A���肪�Ƃ��������܂��B"
    });
  },
  function (){
    this.act({
      img: img.sample3,
      msg: "theater.js�̓A�h�x���`���[�Q�[�����쐬���邽�߂�JavaScript���C�u�����ł��B"
    });
  },
  function (){
    this.act({
      img: img.sample4,
      msg: "���͂͂��̂悤��1�������^�C�v���C�g�����悤�ɕ\������܂��B<br/>"
      + "�^�C�v���ɃN���b�N����ƍŌ�܂ŕ\�����܂��B<br/>"
      + "������x�N���b�N����ƃV�i���I���i�s���܂��B"
    });
  },
  function (){
    this.act({
      img: img.sample5,
      msg: "���͂ɂ̓C�����C��������HTML�^�O���g�p�\�ł��B���s��<br/>������A"
      + "<span style='color:yellow  ;font-size:36px;'>�����̐F��傫����ς���</span>���Ƃ��ł��܂��B"
    });
  },
  function (){
    this.act({
      img: img.sample6,
      msg: "���Ȃ݂ɁA���o�[�W�����ɑ��݂����V�i���I�t�@�C���ҏW�c�[���́A���o�[�W�����ɂ͂���܂���ł��B�B�B<br/>"
      + "�쐬�������ł��O�O�G"
    });
  },
  function (){
    this.act({
      img: img.sample7,
      msg: "�摜�ؑ֎��Ɍ��ʂ��w�肷�邱�Ƃ��ł��܂��BIE6�ȏオ�Ώۂł��B<br/>"
      + "Firefox�AOpera���ł��ꕔ�Ή����Ă��܂��B"
    });
  },
  function (){
    this.act({
      img: img.sample8,
      msg: "���U�C�N(IE�̂�)",
      filter: 115,
      outEffect:'',
      inEffect:''
    });
  },
  function (){
    this.act({
      img: img.sample7,
      msg: "�t�F�[�h(IE�̂�)",
      filter: 106,
      outEffect: '',
      inEffect: ''
    });
  },        
  function (){
    this.act({
      img: img.sample8,
      msg: "�݂��Ⴂ�ɓ���ւ�(IE�̂�)",
      filter: 124,
      outEffect:'',
      inEffect:''
    });
  },
  function (){this.speak("���B");},
  function (){this.speak("Firefox�AOpera���ł��g�p�\�Ȍ��ʂ�����܂��B");},
  function (){
    this.act({
      img: img.sample7,
      msg: "�t�F�[�h�A�E�g�A�t�F�[�h�C���B(IE�݂̂̂��̂Ƃ͕�)",
      filter: '',
      outEffect:'Fade',
      inEffect:'Appear'
    });
  },
  function (){
    this.act({
      img: img.sample8,
      msg: "�u���C���h�A�b�v�A�u���C���h�_�E���B",
      filter: '',
      outEffect:'BlindUp',
      inEffect:'BlindDown'
    });
  },
  function (){this.speak("���B");},
  function (){
    this.act({
      img: img.sample2,
      msg: "�摜�͏�̉摜�{�b�N�X�̒����ɕ\������܂��B"
      + "�摜�{�b�N�X���傫���ꍇ�͏k�����ĕ\�����܂��B�c����͌Œ�ł��B"
    });
  },
  function (){
    this.act({
      img: img.sample9,
      msg: "���̂悤�ɕ\������܂��B���̉摜�͉摜�{�b�N�X�ɍ��킹�ďk������Ă��܂��B",
      filter: '',
      outEffect:'',
      inEffect:''        
    });
  },
  function (){
    this.act({
      img: img.sample10,
      msg: "�摜��''(�󕶎�)���w�肷���800*600�̓���GIF��\�����܂��B"
    });
  },
  function (){
    this.act({
      img: "",
      msg: "���̂悤�ɕ\������܂��B(�����܂��񂪁O�O�G)",
      filter: '',
      outEffect:'',
      inEffect:''  
    });
  },
  function (){
    this.act({
      img: img.sample11,
      msg: "act���\�b�h��img�v���p�e�B���w�肵�Ȃ����A�������́unull�v�Ǝw�肷�邱�ƂŁA"
      + "�摜�����̂܂܂ɕ��͂�؂�ւ��邱�Ƃ��ł��܂��B<br/>"
      + "(speak���\�b�h���g�p���邱�Ƃł����l�̌��ʂ������܂��B)"
    });
  },
  function (){
    this.act({
      img: null,
      msg: "���̍s�̉摜�w��́unull�v�ł��B�摜�͐؂�ւ��܂���B���̂Ƃ��A�摜�ؑ֌��ʂ͖����ł��B"
    });
  },
  function (){
    this.act({
      img: img.sample12,
      msg: "act���\�b�h��msg�v���p�e�B���w�肵�Ȃ����A�������́unull�v�Ǝw�肷�邱�ƂŁA"
      + "���͂����̂܂܂ɁA�摜�݂̂�؂�ւ��邱�Ƃ��ł��܂��B<br/>"
      + "(appear���\�b�h���g�p���邱�Ƃł��A���l�̌��ʂ������܂��B)"
    });
  },
  function (){
    this.act({
      img: img.sample13,
      msg: null,
      filter: 5
    });
  },
  function (){this.appear(img.sample14)},
  function (){this.speak('���̂悤�ɕ\������܂��B');},
  function (){
    this.act({
      img: img.sample2,
      msg: "��{�I�ȋ@�\�͈ȏ�ł��BVer2�ł̐V�@�\���ɂ��Ă�readme.htm���Q�Ƃ��Ă��������B"
    });
  },
  function (){
    this.act({
      img: img.sample1,
      msg: "�I���"
    });
  },
  function (){
    this.act({
      img: 'img/curtain.gif',
      adjust: "FULL",
      filter: '',
      outEffect:'Fade',
      inEffect:'BlindDown'
    });
  }
];

new Theater({
  img: img,
  scenario: scenario,
  curtain: 'img/curtain.gif',
  filter: 4,
  outEffect: 'Fade',
  inEffect: 'Appear'  
});
