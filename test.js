var img = [
  "img/sample1.gif",
  "img/sample2.gif"
];
var scenario = [
  function(){
    this.act({
      img: "img/sample1.gif",
      msg: "テスト"
    });
  },
  function(){
    this.act({
      img: "img/sample2.gif",
      msg: "ようこそ"
    });
  }
];
new Theater({
  img: img,
  scenario: scenario
});
