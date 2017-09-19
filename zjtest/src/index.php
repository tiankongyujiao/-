<?php
	//构建前样式引入（dev)
    $this->eventRegisterCss(array('zjtest/src/css/index.css'));

    //构建后样式引入(dev,test,prd)
    // $this->eventRegisterCss(array('zjtest/dist/css/index.css'));
    //如果eco打包有css则css引入换成下面
    // $this->eventRegisterCss(array('zjtest/dist/css/index.css','zjtest/dist/css/package_index.min.css'));
    
   
    //构建前js
    $this->eventRegisterScript(array('common/eco/lib/ecojs/eco.package.js','common/eco/config/ecoConfig.js','common/eco/systems/mob/mob.js','zjtest/src/js/index.js'));
    
    //构建后
    // $this->eventRegisterScript(array('common/eco/lib/ecojs/eco.js','common/eco/config/ecoConfig.js','common/eco/systems/mob/mob.js','zjtest/dist/js/package_index.min.js','zjtest/dist/js/index.min.js'));
    
    $this->tkd = array(
        'title' => "途牛旅游网",
        'keywords' => "途牛旅游网",
        'description' => "途牛旅游网",
        'pageName' => "无线:运营:暑期大促:主会场",
        'gaContent' => "无线/运营/暑期大促/主会场"
    );
?>


<!--微信分享-->
<div class="wx-share" id="shareArea" style="display:none;">
    <input type="hidden" id="shareTitle" value="title" /> 
    <input type="hidden" id="shareDesc" value="description" /> 
    <input type="hidden" id="shareLink" value="sharelink" /> 
    <img id="shareImg" src="" /> 
</div> 
<div class="wrapper">
  <!--html部分-->
</div>
<!--需要使用的后台接口-->
<input type="hidden" id="getPrize" name="getPrize" value="<?php echo $this->createUrl('/event/raffle/getPrizeAjax');?>"/>
<script type="text/javascript" src="//img2.tuniucdn.com/site/wap/js/new/weixin/wx-share.js"></script>
