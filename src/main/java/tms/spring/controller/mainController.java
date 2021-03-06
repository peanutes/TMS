package tms.spring.controller;


import org.apache.ibatis.annotations.Param;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authz.UnauthorizedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import tms.spring.entity.TreeNode;
import tms.spring.service.CaseAnalyseService;
import tms.spring.service.LoginService;
import tms.spring.utils.CaseAnalyseUtil;
import tms.spring.utils.Constant;
import tms.spring.utils.PropertiesUtil;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * Created by user on 2017/7/14.
 */
@Controller
@RequestMapping("/main")
public class mainController {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private LoginService loginService;

    @Autowired
    private CaseAnalyseService caseAnalyseService;

    @Autowired
    private CaseAnalyseUtil caseAnalyseUtil;


    @RequestMapping(value = "index")
    public String index(Model model) {
        model.addAttribute("username",SecurityUtils.getSubject().getPrincipal());
        model.addAttribute("planHelperList",caseAnalyseService.getPlanHelperList());
        return "index";
    }

    @RequestMapping(value="logout")
    @ResponseBody
    public Map<String, Object> logout(){
        Map<String, Object> map = new HashMap<String, Object>();
        try {
            loginService.logout();
            map.put("code", Constant.CODE_SUCCESS);
        }catch (Exception e){
            logger.error("logout errorMessage:" + e.getMessage());
            map.put("code", Constant.CODE_FAILED);
            map.put("message",e.getMessage());
        }
        return map;
    }


    @RequestMapping(value="updatePwd")
    @ResponseBody
    public Map<String, Object> updatePwd(@RequestBody Map<String,String> jsonMap){
        Map<String, Object> map = new HashMap<String, Object>();
        try {
            loginService.updatePwd(jsonMap);
            map.put("code", Constant.CODE_SUCCESS);
        }catch (Exception e){
            logger.error("getSupportType errorMessage:" + e.getMessage());
            map.put("code", Constant.CODE_FAILED);
            map.put("message",e.getMessage());
        }
        return map;
    }


    @RequestMapping(value="getModuleTree")
    @ResponseBody
    public Map<String, Object> getModuleTree(@RequestBody Map<String,String> jsonMap){
        Map<String, Object> map = new HashMap<String, Object>();
        try {
            TreeNode treeNode=caseAnalyseService.getModuleTree(jsonMap);
            map.put("code", Constant.CODE_SUCCESS);
            map.put("result", treeNode);
        }catch (Exception e){
            logger.error("getModuleTree errorMessage:" + e.getMessage());
            map.put("code", Constant.CODE_FAILED);
            map.put("message",e.getMessage());
        }
        return map;
    }

    @RequestMapping(value="getProjectTree")
    @ResponseBody
    public Map<String, Object> getProjectTree(){
        Map<String, Object> map = new HashMap<String, Object>();
        try {
            TreeNode treeNode=caseAnalyseService.getProjectTree();
            map.put("code", Constant.CODE_SUCCESS);
            map.put("result", treeNode);
        }catch (Exception e){
            logger.error("getModuleTree errorMessage:" + e.getMessage());
            map.put("code", Constant.CODE_FAILED);
            map.put("message",e.getMessage());
        }
        return map;
    }

    @RequestMapping(value="getSupportType")
    @ResponseBody
    public Map<String, Object> getSupportType(@RequestBody Map<String,String> jsonMap){
        Map<String, Object> map = new HashMap<String, Object>();
        try {
            List<String> types=caseAnalyseService.getSupportType(jsonMap);
            map.put("code", Constant.CODE_SUCCESS);
            map.put("result", types);
        }catch (Exception e){
            logger.error("getSupportType errorMessage:" + e.getMessage());
            map.put("code", Constant.CODE_FAILED);
            map.put("message",e.getMessage());
        }
        return map;
    }

    /**
     * 加载阈值参数配置页面
     */
    @RequestMapping(value="loadThresholdPage")
    public String loadThresholdPage(Model model) {
        model.addAttribute("username", SecurityUtils.getSubject().getPrincipal());
        return "thresholdConfig";
    }

    /**
     * 阈值参数配置
     */
    @RequestMapping(value="modifyThreshold")
    public String modifyThreshold(String value) {
        //向配置文件写入threshold值
        String path = getClass().getResource("/").getFile().toString()+"threshold.properties";
        PropertiesUtil.updateValue(path,"threshold",value);


        return "thresholdConfig";
    }

    /**
     * 阈值参数配置
     */
    @RequestMapping(value="autoCaseRepertory")
    public String autoCaseRepertory(Model model) {
        String username=SecurityUtils.getSubject().getPrincipal().toString();
        if(username.equals("admin")){
            model.addAttribute("writer", "<input type=\"text\" name=\"name\" class=\"form-control required\" maxlength=\"10\">");
        }else {
            model.addAttribute("writer", "<input type=\"text\" name=\"name\" class=\"form-control required\" value=\""+username+"\" readonly=\"readonly\">");
        }
        model.addAttribute("username", username);
        return "autoCaseRepertory";
    }

}
