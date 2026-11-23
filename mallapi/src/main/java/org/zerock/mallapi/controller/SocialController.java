package org.zerock.mallapi.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.mallapi.dto.MemberModifyDTO;
import org.zerock.mallapi.service.MemberService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@Log4j2
@RequiredArgsConstructor
public class SocialController {

	private final MemberService memberService;

	@PutMapping("/api/member/modify")
	public Map<String, String> modify(@RequestBody MemberModifyDTO memberModifyDTO) {
		log.info("member modify: " + memberModifyDTO);
		memberService.modifyMember(memberModifyDTO);
		return Map.of("result", "modified");
	}
}
