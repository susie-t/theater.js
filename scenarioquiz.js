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
  {prompt:["お名前を入力してください", "${name}"]},
  function (result){
    this.work.name = result.escapeHTML();
    if(result == ''){
      this.back();
      this.alert("お名前が入力されていません＞＜");
    }else{
      this.confirm("あなたのお名前：" + this.work.name + "<br/>よろしいですか？");
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
        {act:{img:"$I{sample16}", msg:"正解！", filter:100}}
      ],
      "default":[
        {act:{img:"${sample5}", msg:"残念！<br/>答え : " + answer, filter:101}}
      ]
    }}
  ];
};
  
scenario.prompt = function (regExp, answer){
  return [
    {prompt:["入力してください", ""]},
    function(result){
      if(result == ""){
        this.back();
        this.alert("入力してください＞＜");
      }else if(result.match(regExp)){
        this.act({
          filter:103,
          img: "$I{sample16}",
          msg:"正解！"
        });
        this.work.count++;
      }else{
        this.act({
          filter:104,
          img: "$I{sample5}",
          msg:"残念！<br/>答え : " + answer
        });
      }
    }
  ];
};

scenario.main = [
  {setVal:{name:"名無し"}},
  {act:{img:'$I{sample1}', msg:'ようこそ', outEffect:'BlindUp', inEffect:'Appear', filter:''}},
  {act:{img:'$I{sample2}', msg:'このたびは当ゲームをプレイしていただき、ありがとうございます。'}},
  {act:{img:'$I{sample3}', msg:'このゲームは映画に関するクイズゲーム(全２０問)です。JavaScriptで作成されてます。'}},
  {act:{msg:'このゲームについての更なる説明(無駄話)を・・・'}},
  {choice:["聞いてみる", "さっさとクイズへ"]},
  {branch:{
    "聞いてみる":{push:[
      {act:'$I{sample2}',  msg:'では、少々長くなりますが・・・'},
      {msg:'作者は「theater.js」という、アドベンチャーゲームを作成するための'
         + 'JavaScriptライブラリを作成しております。このゲームはそのテストのためのものです。'
         + '特別なプラグインなしに、ブラウザのみで動作します(推奨:WinXp+IE6)。<br/>'
         + 'Ajaxの流行で有名となった「prototype.js」ライブラリを利用しています。'
         + '(作者はその解析記録を'
         + '<a href="http://d.hatena.ne.jp/susie-t/" target="_blank" onclick="Event.limit(event);">ブログ</a>'
         + 'に載せています。)<br/>'
         + '「theater.js」は、去年から作成を始め、ようやくほぼ完成しました。'
         + '今回、知人にお願いして映画に関するクイズを作ってもらい、テストサンプルにした次第です。<br/>'
         + 'ご意見・ご要望がありましたら'
         + '<a href="mailto:susie-t@iris.dricas.com" onclick="Event.limit(event);">メール</a>'
         + 'いただけると幸いです。'
      }
    ]},
    "さっさとクイズへ":{keep:null}
  }},
  {act:{msg:"それでは、クイズをはじめます。"}},
  {act:{img:"$I{sample2}", msg:'まず、お名前を入力してください。'}},
  {push:scenario.getName},
  {act:{img:"$I{sample3}", msg:"ようこそ${name}さん"}},
  {read:'quiz.js'},
  {playCold:"scenario.quiz"},
  {act:{img:"$I{sample1}", msg:'お疲れ様でした'}},
  {act:{img:'img/curtain.gif', msg:'終わり', adjust:"FULL", filter: '', outEffect:'Fade', inEffect:'BlindDown'}}
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
