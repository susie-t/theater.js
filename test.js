var img = [
  "img/sample1.gif",
  "img/sample2.gif"
];
var scenario = [
  function(){
    this.act({
      img: "img/sample1.gif",
      msg: "�e�X�g"
    });
  },
  function(){
    this.act({
      img: "img/sample2.gif",
      msg: "�悤����"
    });
  }
];
new Theater({
  img: img,
  scenario: scenario
});
