package com.esther.jia;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.junit.Test;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

/**
 * @author esther
 * @create 2017-09-08 16:02
 * $DESCRIPTION}
 */

public class UserControllerTest {
    private String url = "http://localhost:8090/user/hello";

    @Test
    public void view() throws Exception {
        HttpClient httpClient = HttpClients.createDefault();
        HttpPost post = new HttpPost(url);
       // post.addHeader("Cookie", "JSESSIONID=" + loginResult.getToken());
        List<NameValuePair> params = new ArrayList<NameValuePair>();
        params.add(new BasicNameValuePair("name", "esther"));

        HttpEntity entity = new UrlEncodedFormEntity(params, Charset.defaultCharset());
        post.setEntity(entity);
        HttpResponse httpResponse = httpClient.execute(post);
        HttpEntity respEntity = httpResponse.getEntity();
        int code = httpResponse.getStatusLine().getStatusCode();
        if (code == 302) {
            String redirect = httpResponse.getHeaders("Location")[0].getValue();
            HttpGet get1 = new HttpGet(redirect);
            httpResponse = httpClient.execute(get1);
            respEntity = httpResponse.getEntity();
        }
        String body = EntityUtils.toString(respEntity);
        ObjectMapper objectMapper = new ObjectMapper();
        System.out.println("body=" + body);

    }
}
