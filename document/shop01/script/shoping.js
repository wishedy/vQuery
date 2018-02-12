Shoping={};
/*
 * opt:
 * {
 * 		userID:用户名
		goodsID:商品ID
		number:购买数量
		callback:function(){}
 * }
 */
Shoping.updataCar=function(opt){
	
	if(opt.userID&&opt.goodsID&&opt.callback){
		$.get("http://datainfo.duapp.com/shopdata/updatecar.php",
		{
			userID:opt.userID,
			goodsID:opt.goodsID,
			number:opt.number?opt.number:0
		},
		function(data){
			opt.callback(data);
		})
	}else{
		console.log("参数提交不全！");
	}
	
}
/*
 *opt:
 * {
 * 		userID
 * 		callback
 * 		$box
 * }
 */
Shoping.getCar=function(opt){
	if(opt.userID){
		$.ajax({
			url:"http://datainfo.duapp.com/shopdata/getCar.php",
			data:{userID:opt.userID},
			dataType:"jsonp",
			success:function(data){
				
				var sum=0;
				for(var i=0;i<data.length;i++){
					sum+=parseInt(data[i].number);
				}
				if(opt.$box){
					opt.$box.text(sum);
				}
				if(opt.callback){
					opt.callback(data);
				}
				
			}
		})
	}else{
		console.log("参数不全！");
	}
	
}
