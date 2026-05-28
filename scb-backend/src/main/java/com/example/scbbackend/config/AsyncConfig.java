package com.example.scbbackend.config;

import com.example.scbbackend.properties.EmailAsyncProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

@Configuration
@EnableAsync
@RequiredArgsConstructor
public class AsyncConfig {

    private final EmailAsyncProperties emailAsyncProperties;

    @Bean("emailExecutor")
    public Executor emailExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        executor.setCorePoolSize(emailAsyncProperties.getCorePoolSize());
        executor.setMaxPoolSize(emailAsyncProperties.getMaxPoolSize());
        executor.setQueueCapacity(emailAsyncProperties.getQueueCapacity());

        executor.setKeepAliveSeconds(emailAsyncProperties.getKeepAliveSeconds());

        executor.setThreadNamePrefix("email-");

        executor.setRejectedExecutionHandler(
                new ThreadPoolExecutor.CallerRunsPolicy());

        executor.setWaitForTasksToCompleteOnShutdown(true);

        executor.setAwaitTerminationSeconds(30);

        executor.initialize();

        return executor;
    }

}
