package org.zerock.mallapi.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.dto.MemberModifyDTO;
import org.zerock.mallapi.repository.MemberRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class MemberServiceImpl implements MemberService {

	private final MemberRepository memberRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public void modifyMember(MemberModifyDTO memberModifyDTO) {
		Member member = memberRepository.findById(memberModifyDTO.getEmail()).orElseThrow();
		member.changePw(passwordEncoder.encode(memberModifyDTO.getPw()));
		member.changeSocial(false);
		member.changeNickname(memberModifyDTO.getNickname());
		memberRepository.save(member);
	}
}
