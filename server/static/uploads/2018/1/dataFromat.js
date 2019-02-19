/**
 * 格式化日期
 * @memberof util
 * @author 李耀 <liyao@jusfoun.com>
 * @param  {String} 传入字符串
 * @return {String} 日期字符串
 */
function dataFromat(val) {
    if (val) {
        let vals=val.replace(new RegExp("-","g"),"\/")
        return new Date(vals).Format("yyyy-MM-dd");
    }
    else
    {
        return "";
    }
}
export { dataFromat };