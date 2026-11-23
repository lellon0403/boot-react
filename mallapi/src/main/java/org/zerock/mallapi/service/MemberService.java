package org.zerock.mallapi.service;

import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.dto.MemberModifyDTO;

@Transactional
public interface MemberService {

	void modifyMember(MemberModifyDTO memberModifyDTO);
}
