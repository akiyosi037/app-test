// UTF-8
/**
 * scrollsmoothly.js
 * Copyright (c) 2008 KAZUMiX
 * http://d.hatena.ne.jp/KAZUMiX/20080418/scrollsmoothly
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * �X�V����
 * 2009/02/12
 * �X�N���[���悪��ʍ���ɂȂ�Ȃ��ꍇ�̋������C��
 * 2008/04/18
 * ���J
 *
*/

(function(){
   var easing = 0.25;
   var interval = 20;
   var d = document;
   var targetX = 0;
   var targetY = 0;
   var targetHash = '';
   var scrolling = false;
   var splitHref = location.href.split('#');
   var currentHref_WOHash = splitHref[0];
   var incomingHash = splitHref[1];
   var prevX = null;
   var prevY = null;

   // �h�L�������g�ǂݍ��݊�������init()�����s����
   addEvent(window, 'load', init);

   // �h�L�������g�ǂݍ��݊������̏���
   function init(){
     // �y�[�W�������N�ɃC�x���g��ݒ肷��
     setOnClickHandler();
     // �O������y�[�W�������N�t���ŌĂяo���ꂽ�ꍇ
     if(incomingHash){
       if(window.attachEvent && !window.opera){
         // IE�̏ꍇ�͂�����Ƒ҂��Ă���X�N���[��
         setTimeout(function(){scrollTo(0,0);setScroll('#'+incomingHash);},50);
       }else{
         // IE�ȊO�͂��̂܂�GO
         scrollTo(0, 0);
         setScroll('#'+incomingHash);
       }
     }
   }

   // �C�x���g��ǉ�����֐�
   function addEvent(eventTarget, eventName, func){
     if(eventTarget.addEventListener){
       // ���_���u���E�U
       eventTarget.addEventListener(eventName, func, false);
     }else if(window.attachEvent){
       // IE
       eventTarget.attachEvent('on'+eventName, function(){func.apply(eventTarget);});
     }
   }
   
   function setOnClickHandler(){
     var links = d.links;
     for(var i=0; i<links.length; i++){
       // �y�[�W�������N�Ȃ�X�N���[��������
       var link = links[i];
       var splitLinkHref = link.href.split('#');
       if(currentHref_WOHash == splitLinkHref[0] && d.getElementById(splitLinkHref[1])){
         addEvent(link, 'click', startScroll);
       }
     }
   }

   function startScroll(event){
     // �����N�̃f�t�H���g������E��
     if(event){ // ���_���u���E�U
       event.preventDefault();
       //alert('modern');
     }else if(window.event){ // IE
       window.event.returnValue = false;
       //alert('ie');
     }
     // this�͌Ăяo�����ɂȂ��Ă�
     setScroll(this.hash);
   }

   function setScroll(hash){
     // �n�b�V������^�[�Q�b�g�v�f�̍��W���Q�b�g����
     var targetEle = d.getElementById(hash.substr(1));
     if(!targetEle)return;
     //alert(scrollSize.height);
     // �X�N���[������W���Z�b�g����
     var ele = targetEle;
     var x = 0;
     var y = 0;
     while(ele){
       x += ele.offsetLeft;
       y += ele.offsetTop;
       ele = ele.offsetParent;
     }
     var maxScroll = getScrollMaxXY();
     targetX = Math.min(x, maxScroll.x);
     targetY = Math.min(y, maxScroll.y);
     targetHash = hash;
     // �X�N���[����~���Ȃ�X�N���[���J�n
     if(!scrolling){
       scrolling = true;
       scroll();
     }
   }

   function scroll(){
     var currentX = d.documentElement.scrollLeft||d.body.scrollLeft;
     var currentY = d.documentElement.scrollTop||d.body.scrollTop;
     var vx = (targetX - currentX) * easing;
     var vy = (targetY - currentY) * easing;
     var nextX = currentX + vx;
     var nextY = currentY + vy;
     if((Math.abs(vx) < 1 && Math.abs(vy) < 1)
       || (prevX === currentX && prevY === currentY)){
       // �ڕW���W�t�߂ɓ��B���Ă�����I��
       scrollTo(targetX, targetY);
       scrolling = false;
       location.hash = targetHash;
       prevX = prevY = null;
       return;
     }else{
       // �J��Ԃ�
       scrollTo(parseInt(nextX), parseInt(nextY));
       prevX = currentX;
       prevY = currentY;
       setTimeout(function(){scroll()},interval);
     }
   }
   
   function getDocumentSize(){
     return {width:Math.max(document.body.scrollWidth, document.documentElement.scrollWidth), height:Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)};
   }

   function getWindowSize(){
     var result = {};
     if(window.innerWidth){
       var box = d.createElement('div');
       with(box.style){
         position = 'absolute';
         top = '0px';
         left = '0px';
         width = '100%';
         height = '100%';
         margin = '0px';
         padding = '0px';
         border = 'none';
         visibility = 'hidden';
       }
       d.body.appendChild(box);
       var width = box.offsetWidth;
       var height = box.offsetHeight;
       d.body.removeChild(box);
       result = {width:width, height:height};
     }else{
       result = {width:d.documentElement.clientWidth || d.body.clientWidth, height:d.documentElement.clientHeight || d.body.clientHeight};
     }
     return result;
   }
   
   function getScrollMaxXY() {
     if(window.scrollMaxX && window.scrollMaxY){
       return {x:window.scrollMaxX, y:window.scrollMaxY};
     }
     var documentSize = getDocumentSize();
     var windowSize = getWindowSize();
     return {x:documentSize.width - windowSize.width, y:documentSize.height - windowSize.height};
   }
   
 }());