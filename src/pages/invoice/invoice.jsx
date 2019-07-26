import React, {Component} from 'react'
import { NavBar, Icon, Button, TextareaItem, List, ActionSheet, Modal, Toast} from 'antd-mobile';
import { createForm, formShape } from 'rc-form';
import './invoice.css'
import {getInfo, sendInfo} from '@/api/server.js'
//获取url参数
function QueryString(QueryName) {
    var name, value = '', i;
    var str = window.location.href.toString(); //获得浏览器地址栏URL串
    str = str.replace("#", "&");
    var num = str.indexOf("?");
    str = str.substr(num + 1); //截取“?”后面的参数串
    var arrtmp = str.split("&"); //将各参数分离形成参数数组
    for (i = 0; i < arrtmp.length; i++) {
        num = arrtmp[i].indexOf("=");
        if (num > 0) {
            name = arrtmp[i].substring(0, num); //取得参数名称
            value = arrtmp[i].substr(num + 1); //取得参数值
            if (name.toUpperCase() == QueryName.toUpperCase()) {
                return decodeURI(value).replace("#", "");
            }
        }
    }
    return "";
}
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
    wrapProps = {
        onTouchStart: e => e.preventDefault(),
    }
}
const alert = Modal.alert
class invoice extends Component {
    static propTypes = {
        form: formShape,
    }
    constructor() {
        super();
        this.state = {
            info:{},
            clicked: '企业',
            clickedIndex:0,
            confirm:false,
            success:true
        };
    }
    showActionSheet = () => {
        const BUTTONS = ['企业', '个人']
        const BADGES = [{index:this.state.clickedIndex,text:<Icon type="check" />}]
        // let BADGES = []
        // if(this.state.clickedIndex == 0){
        //     BADGES = [{index:0,text:<Icon type="check" />},{index:1,text:''}]
        // }else{
        //     BADGES = [{index:0,text:''},{index:1,text:<Icon type="check" />}]
        // }
        ActionSheet.showActionSheetWithOptions({
            options: BUTTONS,
            badges:BADGES,
            maskClosable: true,
            'data-seed': 'logId',
            maskClosable: true,
            wrapProps,
        },
        (buttonIndex) => {
            // this.setState({ clicked: BUTTONS[buttonIndex]})
            switch(buttonIndex){
                case 1||2:
                    this.setState({ clicked: BUTTONS[buttonIndex],clickedIndex: buttonIndex})
                break;
                default:
                    this.setState({ clicked: '企业',clickedIndex: 0})
                break;
            }
        })
    }
    confirm() {
        alert('信息提交后无法修改', '你确定要提交吗', [
            { text: '取消', onPress: () => console.log('cancel') },
            { text: '提交', onPress: () => {
                this.props.form.validateFields((error, values) => {
                    console.log(error,values)
                    if(error === null){
                        let options = Object.assign(values,this.state.info,{invoiceType:this.state.clickedIndex == 0? 'company':'person'})
                        sendInfo(options).then(res => {
                            this.setState({confirm : true})
                        })
                    }else{
                        Toast.fail('请填写未填项', 2)
                    }
                })
            }},
        ])
    }
    closePage() {
        this.setState({confirm : false})
    }
    componentDidMount() {
        let meterNo = QueryString('meterNo')
        let chargeNum = QueryString('chargeNum')
        getInfo({meterNo,chargeNum}).then(res => {
            console.log(res)
            this.setState({info : res.data})
        })
    }
    render() {
        let errors
        const { getFieldProps, getFieldError  } = this.props.form;
        return(
            <section>
                {!this.state.confirm?
                <div><NavBar
                    className="navBar"
                    mode="light"
                   
                    leftContent={<span className="title">开票</span>}
                    onLeftClick={() => console.log('onLeftClick')}
                    rightContent={<div className="des"><span className="order">{this.state.info.chargeNum}</span></div>}
                ></NavBar>
                <List className="list">
                    <ul className="content">
                        <li>
                            <div className="label">发票类型</div>
                            <div className="value" onClick={this.showActionSheet.bind(this)} style={{color:'#0091FF'}}>{this.state.clicked}<Icon className="right" type="right" /></div>
                        </li>
                        <li>
                            <div className="label">用户名</div>
                            <div className="value">{this.state.info.customerName}</div>
                        </li>
                        <li>
                            <div className="label">地址</div>
                            <div className="value">{this.state.info.address}</div>
                        </li>
                        <li>
                            <div className="label">表号</div>
                            <div className="value">{this.state.info.meterNo}</div>
                        </li>
                        <li>
                            <div className="label">金额</div>
                            <div className="value" style={{color:'#FA6400'}}>{this.state.info.sumAmount}</div>
                        </li>
                        <li>
                            <div className="label">税率</div>
                            <div className="value">{this.state.info.taxRate}</div>
                        </li>
                    </ul>
                    <TextareaItem title="发票抬头" placeholder="请输入" {...getFieldProps('invoiceFirst',{rules: [{required: true}]})}/>
                    {(errors = getFieldError('invoiceFirst')) ? <div className="error">请填写发票抬头</div> : null}
                    {this.state.clicked == '企业'&&<div>
                        <TextareaItem title="税号" placeholder="请输入" {...getFieldProps('taxNumber',{rules: [{required: true}]})}/>
                        {(errors = getFieldError('taxNumber')) ? <div className="error">请填写税号</div> : null}
                        <TextareaItem title="开户银行" placeholder="请输入" {...getFieldProps('bank',{rules: [{required: true}]})}/>
                        {(errors = getFieldError('bank')) ? <div className="error">请填写开户银行</div> : null}
                        <TextareaItem title="银行账户" placeholder="请输入" {...getFieldProps('bankAccount',{rules: [{required: true}]})}/>
                        {(errors = getFieldError('bankAccount')) ? <div className="error">请填写银行账户</div> : null}
                    </div>}
                    {this.state.clicked == '个人'&&<div>
                        <TextareaItem title="个人地址" placeholder="请输入" {...getFieldProps('personAdress',{rules: [{required: true}]})}/>
                        {(errors = getFieldError('personAdress')) ? <div className="error">请填写个人地址</div> : null}
                        <TextareaItem title="固定电话" placeholder="请输入" {...getFieldProps('telphone',{rules: [{required: true}]})}/>
                        {(errors = getFieldError('telphone')) ? <div className="error">请填写固定电话</div> : null}
                        <TextareaItem title="接收邮箱" placeholder="请输入" {...getFieldProps('email',{rules: [{required: true}]})}/>
                        {(errors = getFieldError('email')) ? <div className="error">请填写接收邮箱</div> : null}
                    </div>}
                </List>
                <Button type="primary" className="confirm" onTouchStart={this.confirm.bind(this)}>确定</Button>
                </div>:<div style={{background:'#fff',height:'100vh',overflow:'hidden'}}>
                    <NavBar
                        className="navBar"
                        mode="light"
                        leftContent={<Icon type="cross" />}
                        onLeftClick={this.closePage.bind(this)}
                        rightContent={<div className="des">订单号<span className="order">202103023023</span></div>}
                    ></NavBar>
                    <div className="subPage">
                        <div className="subTitle">提交成功</div>
                        <div className="subContent">您的开票信息已提交，请注意查收。</div>
                    </div>
                </div>}
            </section>
        )
    }
}

invoice = createForm()(invoice);
export default invoice