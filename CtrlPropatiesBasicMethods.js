function CtrlPropatiesBasicMethods(){

	
	//==========================================
	//エラー文設定 基本機能
	//=========================================
	
	//エラー文に表示する一行目
	var runningPoint = {
		//=====================================
		//Sentence : String 表示文章
		//View : 使用済か否か
		//=====================================
		"Sentence":"",
		"View":false
	}
	
	//絶対に削除させてはいけないエラーリスト
	var necessaryError = {
		//======================================
		// キー部分及びメッセージ部の仕様は下記のページ参照
		// 設定ファイル読み込み型オブジェクト雛形仕様書
		// http://shitake-crude-production.wikidot.com/lab:setting-file-script-specification
		//=====================================
		"UM-EM-1":["エラー文の設定が間違ってます。\n対象{0}:{1}\n置換指定文章:{2}\n生成分:{3}","{0}","{1}","{2}","{3}"],
		"UM-EM-2":["エラー文を設定する単語の型が不正です。\n対象キー:{0}","{0}"],
		"UM-EM-3":["エラー文設定、置換対象文字リストに誤りがあります。\n対象キー:{0}","{0}"],
		"UM-EM-4":["エラー文を設定する単語リストの型が不正です。\n対象キー:{0}\n指定:{1}\n引数:{2}","{0}","{1}","{2}"],
		"UM-EM-5":["指定エラーキーは削除できません。\n対象キー:{0}","{0}"],
		"UE-EM-1":["エラーキー{0}は存在しません","{0}"],
		"AE-EM-1":["エラーキー{0}は既に存在します","{0}"],
		"UE-P-1":["指定プロパティ{0}は存在しません","{0}"],
		"AE-P-1":["指定プロパティ{0}は既に存在します","{0}"],
		"UM-P-1":["プロパティの指定はString型でおこなってください"],
		"UM-M-1":["指定メソッド{0}は削除できません。","{0}"],
		"UM-T-1":["引数の型が対象プロパティと一致しません。"],
		"UM-T-2":["引数の型が対象プロパティと一致しません。プロパティ型:{0}　引数型:{1}","{0}","{1}"],
		"UM-TF-1":["引数がFunction型ではありません"],
		"UM-TS-1":["引数がString型ではありません"],
		"UM-TS-2":["引数がString型ではありません。\n引数{0}","{0}"],
		"UM-TN-1":["引数がNumber型ではありません"],
		"UM-TO-1":["引数がObject型ではありません"],
		"UM-TO-2":["引数がObject型ではありません。\n引数:{0}","{0}"],
		"UM-TB-1":["引数がBoolean型ではありません"],
		"UM-TB-2":["引数がBoolean型ではありません。\n引数:{0}","{0}"],
		"UM-TA-1":["引数がArray型ではありません"],
		"UM-TA-2":["Arrayの要素数は必ず{0}つ{1}にしてください","{0}","{1}"],
		"UM-NR-1":["引数{0}は規定値{1}を超過しています","{0}","{1}"],
		"UM-NL-1":["引数{0}は規定値{1}を満たしていません","{0}","{1}"],
		"UM-TT-1":["読み込みファイルを設定してください。"],
		"UE-MG-1":["指定のメソッドグループ{0}は存在しません","{0}"],
		"UM-MG-1":["指定のメソッドグループ{0}は削除できません","{0}"],
		"UE-TR-1":["指定の動作{0}は存在しません","{0}"]
	};
	

	
	//エラーリスト
	var ErrorList = {


	}
	
	//エラーリストに必須エラーリストを格納する
	addNecessaryElements(necessaryError,ErrorList);
	
	//エラー文一行目を生成する
	function addOneLinnerInner(sentence){
		//======================================
		//引数
		//sentence : String 一行目に設定する文章
		//
		//返値:
		//Boolean : 稼働成否
		//======================================
		if(getValueType(sentence) != "string"){
			getErrorMessageInner("UM-TS-2",getValueType(sentence));
			return false;
		}
		runningPoint.Sentence = sentence + "\n";
		runningPoint.View = true;
		return true;
	}
	
	//エラー文一行目を削除する
	function removeOneLinnerInner(){
		runningPoint.Sentence = "";
		runningPoint.View = false;
		return true;
	}
	
	
	
	//エラー文をエラーキーから取得する
	function getErrorMessageInner(keyName,msgParts){
		//======================================
		//引数
		//keyName : String パラメーター名
		//msgParts: Array エラー文を構成する文字列の配列
		//
		//返値
		// Boolean : エラー文生成に成功したか否か
		//======================================
		if(getErrorMessageInner.caller){
			if(runningPoint.Sentence.length < 1){
				addOneLinnerInner("エラー関数:" + getErrorMessageInner.caller.name);
			}
		}else{
			addOneLinnerInner("エラー関数不明:");
		}
		if(msgParts == undefined){
			msgParts = new Array();
		}
		var checkerMsgParts = typeof(msgParts);
		if(checkerMsgParts == "string" || checkerMsgParts == "number"){
			msgParts = [msgParts];
		}
		if(!Array.isArray(msgParts)){
			getErrorMessageInner("UM-EM-4",[keyName,"Array",typeof(msgParts)]);
			return false;
		}
		
		var BaseError = ErrorList[keyName][0];
		var ResultErrorMsg = BaseError;
		
		//エラー文の生成
		var ReplaceWords = new Array();
		if(ErrorList[keyName].length > 1){
			ReplaceWords = ErrorList[keyName].slice();
			ReplaceWords.shift();
			var replaceTime = ReplaceWords.length;
			if(msgParts.length < replaceTime){
				replaceTime = msgParts.length;
			}
			for(var i = 0;i < replaceTime;i++){
				var typecheck = typeof(ReplaceWords[i]);
				if(typecheck != "string" && typecheck != "number"){
					getErrorMessageInner("UM-EM-3",[keyName]);
					return false;
				}
				var leftEnd = ResultErrorMsg.indexOf(ReplaceWords[i]);
				if(leftEnd < 0){
					getErrorMessageInner("UM-EM-1",[keyName,BaseError,ReplaceWords[i],ResultErrorMsg]);
					return false;
				}
				typecheck = typeof(msgParts[i]);
				if(typecheck != "string" && typecheck != "number"){
					getErrorMessageInner("UM-EM-2",[keyName]);
					return false;
				}
				var leftSentence = ResultErrorMsg.substring(0,leftEnd);
				var rightSentence = ResultErrorMsg.substring(leftEnd+ReplaceWords[i].length,ResultErrorMsg.length);
				ResultErrorMsg = leftSentence + msgParts[i] + rightSentence;
			}
		}
		if(runningPoint.View){
			ResultErrorMsg = runningPoint.Sentence + ResultErrorMsg;
			removeOneLinnerInner();
			
		}
		throw ResultErrorMsg;
		return true;
	}
	
	//==========================================
	//エラー文設定 カスタマイズ
	//=========================================
	
	//エラー文編集時デフォルト設定
	var ErrorSetting = {
		"Safety":false,
		"Strict":false
	}
	
	//デフォルト設定を上書きする
	function setErrorEditModeInner(usrSet){
		//======================================
		//引数
		//usrSet : Object ユーザが指定したデフォルト設定
		//
		//返値
		// Boolean : 初期設定の変更に成功したか否か 
		//======================================
		var checkObj = isObject(usrSet);
		if(!checkObj[0]){
			getErrorMessageInner("UM-TO-2",checkObj[1]);
			return false;
		}
		var OldSafety = ErrorSetting.Safety;
		var OldStrict = ErrorSetting.Strict;
		for(var i in ErrorSetting){
			if(usrSet[i] != undefined){
				if(typeof(usrSet[i]) != 'boolean'){
					ErrorSetting.Safety = OldSafety;
					ErrorSetting.Strict = OldStrict;
					getErrorMessageInner("UM-TB-1");
					return false;
				}
				ErrorSetting[i] = usrSet[i];
			}
		}
		return true;
	}
	
	//エラー編集時のユーザ設定の検証及び初期設定の読み込み
	function loadErrorEditSetting(usrSet){
		//======================================
		//引数
		//usrSet : Object ユーザが指定した編集設定
		//
		//返値
		// Array :  [0] Variant 設定 [1] Boolean 設定検証成否
		//======================================

		if(!usrSet){
			usrSet = ErrorSetting;
		}
		var checkObj = isObject(usrSet);
		if(!checkObj[0]){
			getErrorMessageInner("UM-TO-2",checkObj[1]);
			return false;
		}
		for(var i in ErrorSetting){
			if(usrSet[i] == undefined){
				usrSet[i] = ErrorSetting[i];
			}else if(typeof(usrSet[i]) != 'boolean'){
				getErrorMessageInner("UM-TB-2",[typeof(usrSet[i])]);
				return [usrSet,false];
			}
		}		
		return [usrSet,true];
	}
	
	//エラーリストのコピーを取得する
	function getErrorListCopyInner(){
		//======================================
		//返値
		// Object : エラーリストのコピー 
		//======================================
		var copyErrorList = new Object();
		for(var i in ErrorList){
			var coppyArray = ErrorList[i].slice();
			copyErrorList[i] = coppyArray;
		}
		return copyErrorList;
	}
	
	//エラー文の追加を行う
	function addErrorInner(usrError,addMode){
		//======================================
		//引数
		//usrError : Object ユーザが定義したエラー文
		//addMode : Object ユーザが指定した編集設定
		//
		//返値
		// Boolean : エラー文追加に成功したか否か
		//======================================
		var check = loadErrorEditSetting(addMode);
		if(!check[1]){
			return false;
		}
		return addErrorHub(false,check[0].Safety,usrError,check[0].Strict);
	}
	
	//エラー文の上書きを行う
	function rewriteErrorInner(usrError,addMode){
		//======================================
		//引数
		//usrError : Object ユーザが定義したエラー文
		//addMode : Object ユーザが指定した編集設定
		//
		//返値
		// Boolean : エラー文上書きに成功したか否か
		//======================================
		var check = loadErrorEditSetting(addMode);
		if(!check[1]){
			return false;
		}
		return addErrorHub(true,check[0].Safety,usrError,check[0].Strict);
	}
	
	//エラー文を追加する
	function addErrorHub(rewrite,safety,usrError,strictMode){
		//======================================
		//引数
		//rewrite : Boolean エラーリストを完全に上書きするか
		//safety : Boolean エラー発生時の巻き戻し処理をするか否か（低速）
		//usrError : Object ユーザが定義したエラー文
		//strictMode: boolean ユーザの定義を幻覚に判定するか否か
		//
		//返値
		// Boolean : エラー文追加に成功したか否か
		//======================================
		var safetyObj = new Object();
		if(safety){
			safetyObj = getErrorListCopyInner();
		}
		if(rewrite){
			ErrorList = new Object();
		}
		var checkObj = isObject(usrError);
		if(!checkObj[0]){
			
			getErrorMessageInner("UM-TO-2",checkObj[1]);
			return false;
		}
		for(var i in usrError){
			if(ErrorList[i] != undefined){
				if(safety){
					ErrorList = safetyObj;
				}
				getErrorMessageInner("AE-EM-1",[i]);
				return false;
			}
			if(!Array.isArray(usrError[i])){
				if(safety){
					ErrorList = safetyObj;
				}
				getErrorMessageInner("UM-TA-1",[i]);
				return false;				
			}
			if(usrError[i].length <= 0){
				getErrorMessageInner("UM-TA-2",["1","以上"]);
				return false;
			}
			if(strictMode){
				for(var j = 0;j < usrError[i].length;j++){
					if(typeof(usrError[i][j]) != "string"){
						if(safety){
							ErrorList = safetyObj;
						}
						getErrorMessageInner("UM-EM-2",[i]);
						return false;							
					}
				}
			}
			ErrorList[i] = usrError[i].slice();
		}
		return true;
	}
	
	
	//エラー文削除
	function removeErrorInner(keyname){
		//======================================
		//引数
		//keyname : String 削除対象エラーキー
		//
		//返値
		// Boolean : エラー文削除に成功したか否か
		//======================================
		return deleteErrorHub(false,keyname);
	}
	
		//エラーリスト削除
	function deleteErrorListInner(){
		//======================================
		//返値
		// Boolean : エラー文削除に成功したか否か
		//======================================
		return deleteErrorHub(true,"");
	}
	
	
	//エラー文削除雛形
	function deleteErrorHub(isAll,keyname){
		//======================================
		//引数
		//isAll : Boolean エラーリストを全削除する
		//keyname : String 削除対象エラーキー
		//
		//返値
		// Boolean : エラー文追加に成功したか否か
		//======================================
		if(isAll){
			ErrorList = new Object();
			addNecessaryError();
			return true;
		}
		if(typeof(keyname) != "string"){
			getErrorMessageInner("UM-TS-1");
			return false;
		}
		if((isNecessayErrorKey(keyname))[0]){
			getErrorMessageInner("UM-EM-5",keyname);
			return false;
		}
		if(ErrorList[keyname] == undefined){
			getErrorMessageInner("UE-EM-1",keyname);
			return false;				
		}
		ErrorList[keyname] = undefined;
		return true;
	}
	
	//=========================================
	//エラー文 機能外出し
	//=========================================
	
	var ErrorObj = {
		getMessage:getErrorMessageInner,//エラーメッセージ取得
		getListCopy:getErrorListCopyInner,//エラーリストコピー取得
		setEditMode:setErrorEditModeInner,//エラー文編集デフォルト設定変更
		addException:addErrorInner,//エラー文追加
		rewriteList:rewriteErrorInner,//エラー文上書き
		removeException:removeErrorInner,//エラー削除
		deleteList:deleteErrorListInner,//エラーリスト削除
		crateErrorFirstLine:addOneLinnerInner,//エラー文一行目生成
		deleteErrorFirstLine:removeOneLinnerInner//エラー文一行目を削除
	}
	if(Object.freeze){
		Object.freeze(ErrorObj);
	}
	this.Error = ErrorObj;

	//==========================================
	//独自オブジェクト基本機能
	//==========================================
	//必須エスケープ文設定
	var NecessaryEacapeList = {
		prefix:"%",
		suffix:";",
		braceL:"{",
		braceR:"}",
		per:"%",
		semicolon:";"
	}
	
	var EacapeList = {
		
	}
	
	addNecessaryElements(NecessaryEacapeList,EacapeList);
	
	//==========================================
	//標準装備メソッド設定 基本機能
	//=========================================
	
	//ファイル読み込み時の設定ファイル
	var ResponseState = {
		Source:"",
		isLoaded:false,
		timeout:2000,
		result:{}
	}
	
	//IE6対応
	if (!window.XMLHttpRequest){
		XMLHttpRequest = function () {
		try {
			return new ActiveXObject("Msxml2.XMLHTTP.6.0");
		} catch (e) {}
		try {
			return new ActiveXObject("Msxml2.XMLHTTP.3.0");
		} catch (e) {}
		try {
			return new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {}
			throw new Error("This browser does not support XMLHttpRequest.");
		};
	}

	//XMLリクエストを送るメソッド　ブラウザバージョン対応
	function textloadInner(source){
		//======================================
		//引数
		//source : String ソースのURL
		//
		//コールバック関数
		//received : 引数XMLオブジェクト
		//======================================
		ResponseState.isLoaded = false;
		var existSource = true;
		if(!source){
			existSource = false;
		}else if(getValueType(source) != "string"){
			getErrorMessageInner("UM-TS-2",[getValueType(source)]);
		}else if(source.length < 1){
			existSource = false;
		}
		if(!existSource){
			if(textSetting.Source.length < 1){
				getErrorMessageInner("UM-TT-1");
				return;
			}
			source = textSetting.Source;
		}
		
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
				if (xhr.readyState === 4 && xhr.status === 200){
					if(!ResponseState.isLoaded){
						ResponseState.isLoaded = true;
						ResponseState.result = xhr;
						userMethods.received(xhr);
					}
					
				}
			}
			xhr.addEventListener("load", function(){
				if(!ResponseState.isLoaded){
					ResponseState.isLoaded = true;
					ResponseState.result = xhr;
					userMethods.received(xhr);
				}
			});
		xhr.open("get", "source");
		xhr.send();
	}
	
	
	//==========================================
	//カスタムメソッド設定 基本機能
	//=========================================
	
	//メソッドに対する動作指定名称
	var RunTypeNameList = {
		create:"create",
		add:"add",
		reset:"reset",
		remove:"remove",
		deleterun:"delete",
		get:"get"
	}
	
	//必須のメソッド
	var NecessaryMethods = {
		received:function(received){},
	}
	
	//必須の実際に起動するメソッド
	var NeccessaryAcctualMethods = {
		received:function(){}
	}
	
	
	//ユーザが設定するメソッド
	var userMethods = {
		
	}
	
	//ユーザが設定する実際に起動するメソッド
	var userActualMethods = {
		
	}
	

	
	//必須メソッドをユーザ設定メソッドに追加
	addNecessaryElements(NecessaryMethods,userMethods);
	//必須起動メソッドを起動メソッドに追加
	addNecessaryElements(NeccessaryAcctualMethods,userActualMethods);

	//必須のメソッドグループ
	var NeccessarySettingMethodsGroup = {
		defaultSet:userMethods
	}

	//ユーザが設定するメソッドグループ
	var userSettingMethodsGroup = {
		
	}
	
	//必須の実際に起動するメソッドグループ
	var NeccessarySettingActualMethodsGroup = {
		defaultSet:userActualMethods
	}

	//ユーザが設定する実際に起動するメソッドグループ
	var UserSettingActualMethodsGroup = {

	}
	
	//必須メソッドグループをメソッドグループに追加
	addNecessaryElements(NeccessarySettingMethodsGroup,userSettingMethodsGroup);
	
	//必須メソッドグループをメソッドグループに追加
	addNecessaryElements(NeccessarySettingActualMethodsGroup,UserSettingActualMethodsGroup);	
	

	
	//メソッド及びメソッドグループの追加削除を行う諸機能のハブ
	function addMethosHubInner(parentMethodName,param,func,runtype){
		//======================================
		//引数:
		//parentMethodName : String メソッドを格納しているグループ名
		//param : String メソッド名
		//func : Function 追加等をする関数
		//runtype: String 既定の文字で決まった動作を行う
		//
		//返値:
		//Boolean : 稼働成否
		//返値(getの場合):
		//Function : 格納された関数
		//======================================
		if(getValueType(actualObj[param]) != "string"){
			getErrorMessageInner("UM-TS-1");
			return false;			
		}
		var parentobj = userSettingMethodsGroup[groupname]:
		var actualObj = UserSettingActualMethodsGroup[groupname];
		var result = false;
		switch(runtype){
			case RunTypeNameList.create:
				result = addPropatyInner(parentMethodName,param,func);
			break;
			case RunTypeNameList.add:
				result = addFunctionToMethodsInnerHub(parentobj,param,actualObj,func);
			break;
			case RunTypeNameList.reset:
				result = resetFunctionInner(parentobj,param,actualObj);
			break;
			case RunTypeNameList.remove:
				result = removePropatyInner(parentobj,param,actualObj);
			break;
			case RunTypeNameList.deleterun:
				result = deleteMethosGroupInner(groupname);
			break;
			case RunTypeNameList.get:
				if(result = new userSettingMethodsGroup[groupname]){
					result = new userSettingMethodsGroup[groupname][param];
				}
				if(!result)result = new Function();
			break;
			default:
				getErrorMessageInner("UE-TR-1",runtype);
			break;
		}
		return result;
	}
	
	//プロパティを追加する
	function addPropatyInner(groupname,methodname,func){
		//======================================
		//引数:
		//groupname : String メソッドを格納しているグループ名
		//methodname : String メソッド名
		//func : Function 関数
		//
		//返値:
		//Boolean : 稼働成否
		//======================================
		if(getValueType(groupname) != "string"){
			getErrorMessageInner("UM-TS-1");
			return false;
		}
		if(getValueType(methodname) != "string"){
			getErrorMessageInner("UM-TS-1");
			return false;
		}
		var functype = getValueType(func);
		if(functype != "function" && functype != "undefined" && functype != "null"){
			getErrorMessageInner("UM-TF-1");
			return false;
		}
		if(userSettingMethodsGroup[groupname] == undefined){
			userSettingMethodsGroup[groupname] = new Object();
			UserSettingActualMethodsGroup[groupname] = new Object();
		}
		if(userSettingMethodsGroup[groupname][methodname] != undefined){
			getErrorMessageInner("AE-P-1",methodname);
			return false;			
		}
		if(functype == "function"){
			userSettingMethodsGroup[groupname][methodname] = func;
		}else{
			userSettingMethodsGroup[groupname][methodname] = function(){};
		}
		UserSettingActualMethodsGroup[groupname][methodname] = function(){};
		return true;
	}
		
	//対象のメソッドを削除する
	function removePropatyInner(parentobj,param,actualObj){
		//======================================
		//引数
		//parentobj : Object 親パラメータ
		//param : String パラメーター名
		//actualObj : Object 実際に起動するメソッド
		//
		//返値
		//Boolean : 動作成功判定
		//======================================
		if(ErrorCheck(obj,param,function(){})){
			return false;
		}
		if(userMethods === parentobj){
			for(var i in NecessaryMethods){
				if(param == i){
					getErrorMessageInner("UM-M-1",getValueType(i));
					return false;
				}
			}
		}
		delete parentobj[param];
		delete actualObj[param];
		return true;
	}
	
	//メソッドグループの削除を行う
	function deleteMethosGroupInner(param){
		//======================================
		//引数
		//param : String 削除対象のグループ名
		//
		//返値
		//Boolean : 動作成功判定
		//======================================
		if(getValueType(param) != "string"){
			getErrorMessageInner("UM-TS-1");
			return false;
		}
		if(userSettingMethodsGroup[groupname] == undefined){
			getErrorMessageInner("UE-MG-1",parentMethodName);
			return false;
		}
		for(var i in NeccessarySettingMethodsGroup){
			if(param == i){
				getErrorMessageInner("UM-MG-1",param);
				return false;
			}
		}
		delete userSettingMethodsGroup[param];
		delete UserSettingActualMethodsGroup[param];
		return true;
	}
	
	
	//指定したプロパティにメソッドを追加する
	function addFunctionToMethodsInnerHub(parentobj,param,actualObj,func){
		//======================================
		//引数
		//parentobj : Object 親パラメータ
		//param : String パラメーター名
		//actualObj : Object 実際に起動するメソッド
		//func : Function 関数
		//
		//返値
		//Boolean : 動作成功判定
		//======================================
		if(!ErrorCheck(parentobj,param,func)){
			return false;
		}
		var targetObj = parentobj;
		if(getValueType(actualObj[param]) == "function"){
			targetObj = actualObj;
		}
		addFunctionInner(targetObj,param,func)
		return true;
	}
	
	//指定のパラメータに関数を追加する
	function addFunctionInner(obj,param,func){
		//======================================
		//引数:
		//obj : Object プロパティを格納している連想配列
		//param : String パラメーター名
		//func : Function 関数
		//
		//返値:
		//Boolean : 稼働成否
		//======================================
		var presentFunc = obj[param];
		var rewriteFunc = function(){
			presentFunc();
			func();
		}
		obj[param] = rewriteFunc;
		return true;
	}
		
	//対象のメソッドを空の状態にする
	function resetFunctionInner(parentobj,param,actualObj){
		//======================================
		//引数
		//parentobj : Object 親パラメータ
		//param : String パラメーター名
		//actualObj : Object 実際に起動するメソッド
		//
		//返値
		//Boolean : 動作成功判定
		//======================================
		if(ErrorCheck(obj,param,function(){})){
			return false;
		}
		var targetObj =  = parentobj;
		if(getValueType(actualObj[param]) == "function"){
			targetObj = actualObj;
		}
		targetObj[param] = function(){};
		return true;
	}
	
	

	//メソッド追加削除時のエラー判定を行う
	function ErrorCheck(obj,param,func){
		//======================================
		//引数
		//obj : Object プロパティを格納している連想配列
		//param : String パラメーター名
		//func : Function 関数
		//
		//返値
		//Boolean : 引数チェック可否
		//======================================
		if(getErrorMessageInner.caller){
			addOneLinnerInner("エラー関数:" + getErrorMessageInner.caller.name);
		}else{
			addOneLinnerInner("エラー関数不明:");
		}
		var ErrorCheckList = [false,false,false,false];
		var ErrorFlag = false;
		if(getValueType(obj) != "object"){
			ErrorFlag = true;
			ErrorCheckList[0] = true;			
		}
		if(getValueType(param) != "string"){
			ErrorFlag = true;
			ErrorCheckList[1] = true;
		}
		if(getValueType(func) != "function"){
			ErrorFlag = true;
			ErrorCheckList[2] = true;
			return false;
		}
		if(!ErrorCheckList[0] && !ErrorCheckList[1]){
			if(obj[param] == undefined){
				ErrorFlag = true;
				ErrorCheckList[3] = true;
			}
		}
		if(ErrorFlag){
			if(ErrorCheckList[0]){
				getErrorMessageInner("UM-TO-1");
			}
			if(ErrorCheckList[1]){
				getErrorMessageInner("UM-TS-1");
			}
			if(ErrorCheckList[2]){
				getErrorMessageInner("UM-TF-1");
			}
			if(ErrorCheckList[3]){
				getErrorMessageInner("UE-P-1");
			}
			return false;
		}
		removeOneLinnerInner();
		return true;
	}
	
	//指定メソッドグループの操作を継承する
	function successMethodsInner(groupname){
		//======================================
		//引数
		//groupname : String メソッドグループ名
		//
		//返値
		//Object : 継承するメソッドを格納したオブジェクト
		//======================================		
		if(!groupname){
			groupname = "defaultSet";
		}
		var methodObject = new Object();
		if(getValueType(groupname) != "string"){
			getErrorMessageInner("UM-TS-1");
			return methodObject;
		}
		for(var i in RunTypeNameList){
			methodObject[RunTypeNameList[i]] = setMethodsGroupInner(groupname,RunTypeNameList[i]);
		}
		if(Object.freeze){
			Object.freeze(methodObject);
		}
		return methodObject;
		
	}
	
	//指定メソッドグループに対する操作を渡す
	function setMethodsGroupInner(parentMethodName,runtype){
		//======================================
		//引数
		//parentMethodName : String メソッドグループ名
		//runtype : String 動作指摘
		//
		//返値
		//Function : 継承するメソッド
		//======================================
		return function(param,func){addMethosHubInner(parentMethodName,param,func,runtype)};
	}
	
	var defaultFunctionList(){
		getXMLObject:textloadInner
		
		
	}
	
	//初期設定された関数のリストのクローンを返す
	function getCloneDefaultFunctionAllInner(){
		//======================================
		//返値
		//Object : 初期設定された関数を格納したオブジェクト
		//======================================				
		var result = new Object();
		for(var i in defaultFunctionList){
			result[i] = new defaultFunctionList[i];
		}
		return result;
	}
	
	//初期設定された関数のクローンを返す
	function getCloneDefaultFunctionInner(funcname){
		//======================================
		//引数
		//funcname : String 関数名
		//
		//返値
		//Function : 該当する関数
		//======================================		
		if(getValueType(funcname) != "string"){
			getErrorMessageInner("UM-TS-1");
			return (new Function());
		}
		var result = new Function();
		if(defaultFunctionList[funcname]){
			result = new defaultFunctionList[funcname]
		}
		return result
	}
	
	
	//==========================================
	//プロパティ設定 外出し
	//=========================================
	
	//変更ができない固定メソッド
	var FreezeMethods = {
		sucessMethodsControler:successMethodsInner,
		getDefaultMethod:getCloneDefaultFunctionInner,
		getAllDefaultMethod:getCloneDefaultFunctionAllInner
	}	

	if(Object.freeze){
		Object.freeze(FreezeMethods);
	}
	this.Methods = FreezeMethods;	
	
	//==========================================
	//独自オブジェクト外出し
	//==========================================


	//==========================================
	//補助メソッド
	//=========================================
	function isObject(target){
		//=====================================
		//引数
		//target : Variant 型判定対象変数
		//
		//返値
		//Array : [0]オブジェクトか否か　[1]変数の型
		//=====================================
		if(typeof(target) != 'object'){
			return [false,typeof(target)];
		}
		if(Array.isArray(target)){
			return [false,"array"];
		}
		if(Object.prototype.toString(target) != "[object Object]"){
			return [false,Object.prototype.toString(target)];
		}
		
		return [true,'object'];
		
		
	}
	
	//エラーキーか確かめる
	function isNecessayErrorKey(target){
		//==============================
		//引数
		//target : String 検査対象キー名称
		//
		//返値
		//Array
		// [0]Boolean : 必須エラーキー(true)/必須エラーキーではない(false)
		// [2]Boolean : 動作成功(true)/動作失敗(false)
		//==============================
		if(typeof(target) != 'string'){
			throw("エラーキーはString型で指定してください");
			return [false,false];
		}
		for(var i in necessaryError){
			if(target == i){
				return [true,true];
			}
		}
		return [false,true];
		
	}
	
	//カスタムプロパティに必須プロパティを追加する
	function addNecessaryElements(necessary,userList){
		//==============================
		//necessary : Object 必須プロパティ
		//userList : Object カスタムプロパティ
		//==============================
		for(var i in necessary){
			if(userList[i] == undefined){
				userList[i] = necessary[i];
			}
		}
	}
	
	//変数の型を取得する
	function getValueType(target){
	//==============================
	//引数
	//target : Variant 変数
	//
	//返値
	//String : 変数の型名
	//==============================
        var types = typeof(target);
        if(types != "object"){
            return types;
        }
        if(Array.isArray(target)){
            return "array";
        }
        var types = Object.prototype.toString(target);
        types = types.split("[object ").join("").split("]").join("");
        return types.toLowerCase();
    }
}