package com.example.scbbackend.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public enum ApiCode {

    /* SUCCESS */
    VERIFY_OTP_SUCCESS(2000, "Verify otp successfully", HttpStatus.OK),
    RESEND_OTP_SUCCESS(2001, "Resend otp successfully", HttpStatus.OK),
    REGISTER_AVAILABILITY(2000, "Register availability", HttpStatus.OK),
    REGISTER_SUCCESS(2001, "Register successfully", HttpStatus.OK),
    LOGIN_SUCCESS(2002, "Login successfully", HttpStatus.OK),
    GET_FACILITIES_WITH_COURTS_SUCCESS(2003, "Get facilities with courts successfully", HttpStatus.OK),
    GET_CATALOG_SUCCESS(2004, "Get catalog successfully", HttpStatus.OK),
    UPLOAD_MEDIA_SUCCESS(2005, "Upload media successfully", HttpStatus.OK),
    GET_ALL_PRICE_TEMPLATES_SUCCESS(2006, "Get all price templates successfully", HttpStatus.OK),
    GET_PRICE_TEMPLATE_SUCCESS(2007, "Get price template successfully", HttpStatus.OK),
    CREATE_COURT_SUCCESS(2008, "Create court successfully", HttpStatus.CREATED),
    GET_PRICE_TEMPLATE_ITEMS_SUCCESS(2009, "Get price template items successfully", HttpStatus.OK),
    CREATE_PRICE_TEMPLATE_SUCCESS(2010, "Create price template successfully", HttpStatus.OK),
    UPDATE_PRICE_TEMPLATE_SUCCESS(2011, "Update price template successfully", HttpStatus.OK),
    DELETE_PRICE_TEMPLATE_SUCCESS(2012, "Delete price template successfully", HttpStatus.OK),
    GET_FACILITIES_SUCCESS(2013, "Get facilities successfully", HttpStatus.OK),
    GET_ALL_PRICE_TEMPLATE_OPTIONS_SUCCESS(2014, "Get price template options successfully", HttpStatus.OK),
    GET_ALL_PROVINCES_SUCCESS(2015, "Get all provinces successfully", HttpStatus.OK),
    GET_DISTRICTS_SUCCESS(2016, "Get districts successfully", HttpStatus.OK),
    GET_WARDS_SUCCESS(2017, "Get wards successfully", HttpStatus.OK),
    CREATE_FACILITY_SUCCESS(2018, "Create facility successfully", HttpStatus.OK),
    UPDATE_FACILITY_SUCCESS(2019, "Update facility successfully", HttpStatus.OK),
    DELETE_FACILITY_SUCCESS(2019, "Delete facility successfully", HttpStatus.OK),
    GET_FACILITY_SUCCESS(2019, "Get facility successfully", HttpStatus.OK),

    /* BUSINESS ERRORS */
    INPUT_INVALID(1000, "Input invalid", HttpStatus.BAD_REQUEST),
    GENDER_INVALID(1000, "Gender invalid", HttpStatus.BAD_REQUEST),
    ROLE_INVALID(1000, "Role invalid", HttpStatus.BAD_REQUEST),
    ACCOUNT_EXISTED(1001, "Account existed", HttpStatus.BAD_REQUEST),
    OTP_CHANNEL_INVALID(1000, "Otp channel invalid", HttpStatus.BAD_REQUEST),
    OTP_INVALID(1000, "Otp invalid", HttpStatus.BAD_REQUEST),
    OTP_EXPIRED(1000, "Otp expired", HttpStatus.BAD_REQUEST),
    OTP_MAX_ATTEMPTS(1000, "Otp max attempts", HttpStatus.BAD_REQUEST),
    OTP_INCORRECT(1000, "Otp incorrect", HttpStatus.BAD_REQUEST),
    ACCOUNT_NOT_FOUND(1001, "Account not found", HttpStatus.NOT_FOUND),
    PASSWORD_INCORRECT(1002, "Password incorrect", HttpStatus.BAD_REQUEST),
    ACCOUNT_BANNED(1003, "Account banned", HttpStatus.BAD_REQUEST),
    REFRESH_TOKEN_INVALID(1004, "Refresh token invalid", HttpStatus.BAD_REQUEST),
    REFRESH_TOKEN_EXPIRED(1004, "Refresh token expired", HttpStatus.BAD_REQUEST),
    TOKEN_INVALID(1005, "Token invalid", HttpStatus.BAD_REQUEST),
    TOKEN_EXPIRED(1005, "Token expired", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED(1005, "Unauthorized", HttpStatus.UNAUTHORIZED),
    UNAUTHENTICATED(1005, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    USER_NOT_FOUND(1006, "User not found", HttpStatus.NOT_FOUND),
    PRICE_TEMPLATE_NOT_FOUND(1007, "Price template not found", HttpStatus.NOT_FOUND),
    PRICE_TEMPLATE_IN_USE(1008, "Price template is being used by a court and cannot be deleted", HttpStatus.BAD_REQUEST),
    PROVINCE_NOT_FOUND(1009, "Province not found", HttpStatus.NOT_FOUND),
    DISTRICT_NOT_FOUND(10010, "District not found", HttpStatus.NOT_FOUND),
    WARD_NOT_FOUND(10011, "Ward not found", HttpStatus.NOT_FOUND),
    FACILITY_NOT_FOUND(10012, "Facility not found", HttpStatus.NOT_FOUND),

    /* SYSTEM ERRORS */

    ;

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

}
