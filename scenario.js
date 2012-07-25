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
      msg: "theater.jsサンプル(基本編)です。画面をクリックするたびにシナリオが進行します。<br/>"
      + "(Enterキー、またはスペースキーでも進行します。)"
    });
  },
  function (){
    this.act({
      img: img.sample2,
      msg: "このたびはtheater.jsをダウンロードしていただき、ありがとうございます。"
    });
  },
  function (){
    this.act({
      img: img.sample3,
      msg: "theater.jsはアドベンチャーゲームを作成するためのJavaScriptライブラリです。"
    });
  },
  function (){
    this.act({
      img: img.sample4,
      msg: "文章はこのように1文字ずつタイプライトされるように表示されます。<br/>"
      + "タイプ中にクリックすると最後まで表示します。<br/>"
      + "もう一度クリックするとシナリオが進行します。"
    });
  },
  function (){
    this.act({
      img: img.sample5,
      msg: "文章にはインライン属性のHTMLタグが使用可能です。改行＞<br/>したり、"
      + "<span style='color:yellow  ;font-size:36px;'>文字の色や大きさを変える</span>こともできます。"
    });
  },
  function (){
    this.act({
      img: img.sample6,
      msg: "ちなみに、旧バージョンに存在したシナリオファイル編集ツールは、現バージョンにはありませんです。。。<br/>"
      + "作成検討中です＾＾；"
    });
  },
  function (){
    this.act({
      img: img.sample7,
      msg: "画像切替時に効果を指定することができます。IE6以上が対象です。<br/>"
      + "Firefox、Opera等でも一部対応しています。"
    });
  },
  function (){
    this.act({
      img: img.sample8,
      msg: "モザイク(IEのみ)",
      filter: 115,
      outEffect:'',
      inEffect:''
    });
  },
  function (){
    this.act({
      img: img.sample7,
      msg: "フェード(IEのみ)",
      filter: 106,
      outEffect: '',
      inEffect: ''
    });
  },        
  function (){
    this.act({
      img: img.sample8,
      msg: "互い違いに入れ替え(IEのみ)",
      filter: 124,
      outEffect:'',
      inEffect:''
    });
  },
  function (){this.speak("等。");},
  function (){this.speak("Firefox、Opera等でも使用可能な効果があります。");},
  function (){
    this.act({
      img: img.sample7,
      msg: "フェードアウト、フェードイン。(IEのみのものとは別)",
      filter: '',
      outEffect:'Fade',
      inEffect:'Appear'
    });
  },
  function (){
    this.act({
      img: img.sample8,
      msg: "ブラインドアップ、ブラインドダウン。",
      filter: '',
      outEffect:'BlindUp',
      inEffect:'BlindDown'
    });
  },
  function (){this.speak("等。");},
  function (){
    this.act({
      img: img.sample2,
      msg: "画像は上の画像ボックスの中央に表示されます。"
      + "画像ボックスより大きい場合は縮小して表示します。縦横比は固定です。"
    });
  },
  function (){
    this.act({
      img: img.sample9,
      msg: "このように表示されます。この画像は画像ボックスに合わせて縮小されています。",
      filter: '',
      outEffect:'',
      inEffect:''        
    });
  },
  function (){
    this.act({
      img: img.sample10,
      msg: "画像に''(空文字)を指定すると800*600の透明GIFを表示します。"
    });
  },
  function (){
    this.act({
      img: "",
      msg: "このように表示されます。(見えませんが＾＾；)",
      filter: '',
      outEffect:'',
      inEffect:''  
    });
  },
  function (){
    this.act({
      img: img.sample11,
      msg: "actメソッドのimgプロパティを指定しないか、もしくは「null」と指定することで、"
      + "画像をそのままに文章を切り替えることができます。<br/>"
      + "(speakメソッドを使用することでも同様の効果が得られます。)"
    });
  },
  function (){
    this.act({
      img: null,
      msg: "この行の画像指定は「null」です。画像は切り替わりません。このとき、画像切替効果は無効です。"
    });
  },
  function (){
    this.act({
      img: img.sample12,
      msg: "actメソッドのmsgプロパティを指定しないか、もしくは「null」と指定することで、"
      + "文章をそのままに、画像のみを切り替えることができます。<br/>"
      + "(appearメソッドを使用することでも、同様の効果が得られます。)"
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
  function (){this.speak('このように表示されます。');},
  function (){
    this.act({
      img: img.sample2,
      msg: "基本的な機能は以上です。Ver2での新機能等についてはreadme.htmを参照してください。"
    });
  },
  function (){
    this.act({
      img: img.sample1,
      msg: "終わり"
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
