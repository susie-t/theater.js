scenario.quiz = [
  {setVal:{count:0}},

  {act:{filter:1, img:"$I{sample4}", msg:'��P�� �F �ăA�J�f�~�[�܂œ��{�l��܎҂��ł���������͈ߑ��f�U�C���܂ł���H'}},
  {push:scenario.choice(["�͂�", "������"], "������")},
  {act:{msg: '���m�� �F �ő��͉Ȋw�Z�p�܂łT��B�ߑ��f�U�C���܂͂R��B'}},

  {act:{filter:2, img:"$I{sample4}", msg: '��Q�� �F �O�J�K��ē�̂����A���Ƃ�����łȂ��̂́H'}},
  {push:scenario.choice(["�΂̑�w", "�݂�Ȃ̂���", "���a�I�̎���"], "�݂�Ȃ̂���")},
  
  {act:{filter:3, img: "${sample4}", msg: "��R�� �F 2006�N���W�[��(�S�[���f�����Y�x���[��)��i�܂ɋP�����̂́H(�����Ђ炪�ȂS�����{�����ł�������������)"}},
  {push:scenario.prompt(/�X�̔���[�Q2]/i, "�X�̔��΂Q")},
  
  {act:{filter:4, img: "${sample4}", msg: '��S�� �F ������A���R�~������Ȃ̂́H'}},
  {push:scenario.choice(["�E���g�����@�C�I���b�g", "V�t�H�[�E���F���f�b�^", "�g�D�[�����C�_�["], "V�t�H�[�E���F���f�b�^")},
  {act:{msg: '���m�� �F �A�����E���[�A�ƃf���B�b�h�E���C�h�ɂ����80�N��ɔ��\���ꂽ�R�~�b�N���x�[�X�B'}},

  {act:{filter:5, img: "${sample4}", msg: '��T�� �F �w�^�钆�̖펟����쑽����x�̏o���҂̒��ň�l�����������c���������̂́H'}},
  {push:scenario.choice(["�Óc�V��", "���{�T�_�I", "�r��ǁX"], "�Óc�V��")},
  {act:{msg: '���m�� �F �Óc�V���͌��c���V�����A���Q�l�͑�l�v��B'}},

  {act:{filter:6, img: "${sample4}", msg: '��U�� �F �w�N���b�^�[�R�x�w�M���o�[�g�E�O���C�v�x�w�N�C�b�N���f�b�h�x�ɋ��ʂ���o���҂̃t���l�[���́H(�S�p�J�^�J�i�ł�������������)'}},
  {push:scenario.prompt(/���I�i���h[�E�\s]?�f�B?�J�v���I/i, "���I�i���h�E�f�B�J�v���I")},

  {act:{filter:7, img: "${sample4}", msg: '��V�� �F �w���i���U�E�X�}�C���x�͂���l�̎��`���甭�z���ꂽ�ƌ����Ă��܂��B����͎��̂����̒N�H'}},
  {push:scenario.choice(["�v����", "�}�f���[���E�I���u���C�g", "�q�����[�E�N�����g��"], "�q�����[�E�N�����g��")},
  {act:{msg: '���m�� �F �R�l�Ƃ��A�f��̕���̃E�F���Y���[��w�o�g�B�v����͏Ӊ�΂̍ȁA�l�E�I���u���C�g�͌��č��������A�g�E�N�����g���͕ď�@�c���Ńr���E�N�����g�����đ哝�̂̍ȁB'}},
  
  {act:{filter:8, img: "${sample4}", msg: '��W�� �F �䂤�΂荑�ۃt�@���^�X�e�B�b�N�f��Ղ��疼�Â����l�����o�ꂷ��Q�E�^�����e�B�[�m�č�́H(�S�p�J�^�J�i�ł�������������)'}},
  {push:scenario.prompt(/�L��[�E�\s]?�r��\s*((vol|�u�n�k|������)\.?[1�P])?/i, "�L���E�r�� Vol.1")},
  {act:{msg: '���m�� �F �I�R�疾���h�S�[�S�[�[���h�������Ă���B�h�S�[�S�[�h�́u�}�b�nGoGoGo�v���炾�Ƃ��B'}},
  
  {act:{filter:9, img: "${sample4}", msg: "��X�� �F �w�P�P'�O�X''�O�P�^�Z�v�e���o�[�P�P�x�̃C�����҂̊ē́H"}},
  {push:scenario.choice(["�A�b�o�X�E�L�A���X�^�~", "�}�W�b�h�E�}�W�f�B", "�T�~���E�}�t�}���o�t"], "�T�~���E�}�t�}���o�t")},
  {act:{msg: '���m�� �F�w�u���b�N�{�[�h�@�w�����l�x�w�ߌ�̌܎��x�Ȃǂ̊ēB'}},
  
  {act:{filter:10, img: "${sample4}", msg: "��P�O�� �F �w�t���K�[���x(�V�l�J�m������)�͑��f���ЂS��(���f�A����A���|�A�p��)�ȊO�̐���œ��{�A�J�f�~�[�܍ŗD�G��i�܂���܂������߂Ă̍�i�ł���?"}},
  {push:scenario.choice(["�͂�", "������"], "������")},
  {act:{msg: '���m�� �F�w�c�B�S�C�l�����C�[���x(�V�l�}�v���Z�b�g����)���ŏ��B'}},
  
  {act:{filter:11, img: "${sample4}", msg: "��P�P�� �F �w�u���b�N���C���x�̃��X�g�V�[���ɂ́A�T�g�E(���c�D��)���E�����̂Ƒߕ߂����̂Ɠ�̃o�[�W���������ꂽ�H"}},
  {push:scenario.choice(["�͂�", "������"], "�͂�")},
  {act:{msg: "���m�� �F�B�e���ɋr�{���ύX���ꂽ���߂Ƀo�[�W���������������݁B�ŏI�I�ɂ͑ߕ߂��������̗p���ꂽ�B"}},
  
  {act:{filter:12, img: "${sample4}", msg: "��P�Q�� �F �w�����ߐH���x�w�s���@�r�k�d�d�o�k�d�r�r�@�s�n�v�m�x�w�ݘa�c���N��A���x�̌���҂R�l�ɋ��ʂ��邱�Ƃ́H"}},
  {push:scenario.choice(["�o�g�n", "�u���C�N�����G��", "��w�ł̐�U"], "�u���C�N�����G��")},
  {act:{msg: "���m�� �F�w�{�̎G���x�Ńu���C�N�B"}},
  
  {act:{filter:13, img: "${sample4}", msg: "��P�R�� �F �w�o�x���x�̃^�C�g���̗R���ł���o�x���̓��̋L�q������̂́A���񐹏��̉��L�H"}},
  {push:scenario.choice(["�n���L", "���r�L", "�\���L"], "�n���L")},
  
  {act:{filter:14, img: "${sample4}", msg: "��P�S�� �F �Q�[���Łw�����@���x�̃v���f���[�T�[�́H"}},
  {push:scenario.choice(["��t�֎u", "�����G�v", "���z���m"], "���z���m")},
  {act:{msg: "���m�� �F��t�֎u�́w��_�x�ȂǁA�����G�v�́w���^���M�A�\���b�h�x�ȂǁB"}},

  {act:{filter:15, img: "${sample4}", msg: "��P�T�� �F ���{�Ō���f�悪����E���J����Ă����̂́H"}},
  {push:scenario.choice(["�X�[�p�[�}��", "�X�p�C�_�[�}��", "�o�b�g�}��"], "�X�p�C�_�[�}��")},
  {act:{msg: "���m�� �F�P�X�V�W�N���J�A�|�{�O��ēA���R�_��(�����V��)�剉�B"}},

  {act:{filter:16, img: "${sample4}", msg: "��P�U�� �F �w�Q���b�p�I�x�ƕ�������t���[�Y�A�p��Ő������Â�ƁH(���p�p���ł�������������)"}},
  {push:scenario.prompt(/get\s+up\!?/i, "Get Up")},
  {act:{msg: "���m�� �F�i�E�u���E�����wGet Up (I Feel Like Being A) Sex Machine�x�̒��ł���Ԃ��B"}},

  {act:{filter:17, img: "${sample4}", msg: "��P�V�� �F �w�n�`�~�c�ƃN���[�o�[�x�w���C����̓��x�w���ȕ���x�̉��y�́A�S�Ċǖ�悤���ł���H"}},
  {push:scenario.choice(["�͂�", "������"], "�͂�")},

  {act:{filter:18, img: "${sample4}", msg: "��P�W�� �F �e�E�e�E�R�b�|���͑��q���f��ē��H"}},
  {push:scenario.choice(["�͂�", "������"], "�͂�")},
  {act:{msg: "���m�� �F���}���E�R�b�|���B�w�b�p�x(���{���J�Q�O�O�Q�N)�Ŋēf�r���[�B"}},

  {act:{filter:19, img: "${sample4}", msg: "��P�X�� �F �w�W���W���̊�Ȗ`���@�t�@���g�� �u���b�h�x�̌���w�W���W���̊�Ȗ`���x�́A���ݑ�V����A�ڒ��B���̕���́H(�S�p�J�^�J�i�ł�������������)"}},
  {push:scenario.prompt(/�X�e�B�[��[�E�\s]?�{�[��[�E�\s]?����/i, "�X�e�B�[���E�{�[���E���� ")},
  {act:{msg: "���m�� �F�w�E���g���W�����v�x�ŘA�ڒ��B"}},

  {act:{filter:20, img: "${sample4}", msg: "��Q�O�� �F �s�E�o�[�g���ē�łȂ��̂́H"}},
  {push:scenario.choice(["�`���[���[�ƃ`���R���[�g�H��","�}�[�Y�E�A�^�b�N�I","�i�C�g���A�[�E�r�t�H�A�E�N���X�}�X"], "�i�C�g���A�[�E�r�t�H�A�E�N���X�}�X")},
  {act:{msg: "���m�� �F �ē̓w�����[�E�Z���b�N�B�s�E�o�[�g���͐���A���āA�L�����N�^�[�ݒ��S���B"}},
  
  {act:{msg: "�N�C�Y�I���I�I"}},
  {act:{msg: "${name} ����̌��ʁF 20 �⒆ ���� ${count} ��"}},
  function (){
    if(this.work.count < 10){
      this.push([
        {act:{img: "${sample6}", msg: "�����G"}},
        {confirm:"���������ǒ��킵�܂����H"}
      ]);
    }else if(this.work.count < 20){
      this.push([
        {act:{img: "${sample2}", msg: "���������O�O�G"}},
        {confirm:"���������ǒ��킵�܂����H"}      ]);
    }else{
      this.push([
        {act:{img: "${sample7}", msg: "�S�␳���I"}},
        {act:{msg:"���߂łƂ��������܂��O�O"}}
      ]);
    }
    this.keep();
  },
  function (result){
    if(result){
      this.retake();
    }
    this.keep();
  }
]; 
