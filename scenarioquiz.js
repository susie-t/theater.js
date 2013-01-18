var imgs = {
  sample1: 'img/sample1.gif',
  sample2: 'img/sample2.gif',
  sample3: 'img/sample3.gif',
  sample4: 'img/sample4.gif',
  sample5: 'img/sample5.gif',
  sample6: 'img/sample6.gif',
  sample7: 'img/sample7.gif',
  sample16: 'img/sample16.gif'
};

var scenario = {};

scenario.getName = [
  {prompt:["�����O����͂��Ă�������", "${name}"]},
  function (result){
    this.work.name = result.escapeHTML();
    if(result == ''){
      this.back();
      this.alert("�����O�����͂���Ă��܂��񁄁�");
    }else{
      this.confirm("���Ȃ��̂����O�F" + this.work.name + "<br/>��낵���ł����H");
    }
  },
  function(result){
    if(!result) this.retake();
    this.keep();
  }
];

scenario.choice = function (choices, answer){
  return [
    {choice:choices},
    {branch:{
      answer:[
        function(){
          this.work.count++;
          this.keep();
        },
        {act:{img:"$I{sample16}", msg:"�����I", filter:100}}
      ],
      "default":[
        {act:{img:"${sample5}", msg:"�c�O�I<br/>���� : " + answer, filter:101}}
      ]
    }}
  ];
};
  
scenario.prompt = function (regExp, answer){
  return [
    {prompt:["���͂��Ă�������", ""]},
    function(result){
      if(result == ""){
        this.back();
        this.alert("���͂��Ă�����������");
      }else if(result.match(regExp)){
        this.act({
          filter:103,
          img: "$I{sample16}",
          msg:"�����I"
        });
        this.work.count++;
      }else{
        this.act({
          filter:104,
          img: "$I{sample5}",
          msg:"�c�O�I<br/>���� : " + answer
        });
      }
    }
  ];
};

scenario.main = [
  {setVal:{name:"������"}},
  {act:{img:'$I{sample1}', msg:'�悤����', outEffect:'BlindUp', inEffect:'Appear', filter:''}},
  {act:{img:'$I{sample2}', msg:'���̂��т͓��Q�[�����v���C���Ă��������A���肪�Ƃ��������܂��B'}},
  {act:{img:'$I{sample3}', msg:'���̃Q�[���͉f��Ɋւ���N�C�Y�Q�[��(�S�Q�O��)�ł��BJavaScript�ō쐬����Ă܂��B'}},
  {act:{msg:'���̃Q�[���ɂ��Ă̍X�Ȃ����(���ʘb)���E�E�E'}},
  {choice:["�����Ă݂�", "�������ƃN�C�Y��"]},
  {branch:{
    "�����Ă݂�":{push:[
      {act:'$I{sample2}',  msg:'�ł́A���X�����Ȃ�܂����E�E�E'},
      {msg:'��҂́utheater.js�v�Ƃ����A�A�h�x���`���[�Q�[�����쐬���邽�߂�'
         + 'JavaScript���C�u�������쐬���Ă���܂��B���̃Q�[���͂��̃e�X�g�̂��߂̂��̂ł��B'
         + '���ʂȃv���O�C���Ȃ��ɁA�u���E�U�݂̂œ��삵�܂�(����:WinXp+IE6)�B<br/>'
         + 'Ajax�̗��s�ŗL���ƂȂ����uprototype.js�v���C�u�����𗘗p���Ă��܂��B'
         + '(��҂͂��̉�͋L�^��'
         + '<a href="http://d.hatena.ne.jp/susie-t/" target="_blank" onclick="Event.limit(event);">�u���O</a>'
         + '�ɍڂ��Ă��܂��B)<br/>'
         + '�utheater.js�v�́A���N����쐬���n�߁A�悤�₭�قڊ������܂����B'
         + '����A�m�l�ɂ��肢���ĉf��Ɋւ���N�C�Y������Ă��炢�A�e�X�g�T���v���ɂ�������ł��B<br/>'
         + '���ӌ��E���v�]������܂�����'
         + '<a href="mailto:susie-t@iris.dricas.com" onclick="Event.limit(event);">���[��</a>'
         + '����������ƍK���ł��B'
      }
    ]},
    "�������ƃN�C�Y��":{keep:null}
  }},
  {act:{msg:"����ł́A�N�C�Y���͂��߂܂��B"}},
  {act:{img:"$I{sample2}", msg:'�܂��A�����O����͂��Ă��������B'}},
  {push:scenario.getName},
  {act:{img:"$I{sample3}", msg:"�悤����${name}����"}},
  {read:'quiz.js'},
  {playCold:"scenario.quiz"},
  {act:{img:"$I{sample1}", msg:'�����l�ł���'}},
  {act:{img:'img/curtain.gif', msg:'�I���', adjust:"FULL", filter: '', outEffect:'Fade', inEffect:'BlindDown'}}
];

var theater = new Theater({
  scenario: scenario.main,
  imgs:imgs,
  filter:106,
  curtain: 'img/curtain.gif',
  outEffect:'Fade',
  inEffect:'Appear',
  _:null  
});
