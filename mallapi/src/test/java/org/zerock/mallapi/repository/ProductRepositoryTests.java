package org.zerock.mallapi.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.Product;
import org.zerock.mallapi.domain.ProductImage;

@SpringBootTest(properties = {
	"spring.datasource.url=jdbc:h2:mem:product-tests;MODE=MariaDB;DATABASE_TO_LOWER=TRUE",
	"spring.jpa.hibernate.ddl-auto=create-drop"
})
@Transactional
public class ProductRepositoryTests {

	@Autowired
	ProductRepository productRepository;

	@Test
	public void testInsert() {
		for (int i = 0; i < 10; i++) {
			Product product = Product.builder()
					.pname("상품" + i)
					.price(100 * i)
					.pdesc("상품설명 " + i)
					.build();
			product.addImageString("IMAGE1.jpg");
			product.addImageString("IMAGE2.jpg");
			productRepository.save(product);
		}
		productRepository.flush();
		assertEquals(10, productRepository.count());
		assertEquals(10, productRepository.selectList(PageRequest.of(0, 10)).getTotalElements());
	}

	@Test
	public void testListWithoutImage() {
		Product product = Product.builder()
				.pname("이미지 없는 상품")
				.price(100)
				.build();
		productRepository.saveAndFlush(product);

		var result = productRepository.selectList(PageRequest.of(0, 10));

		assertEquals(1, result.getTotalElements());
		assertNull(result.getContent().getFirst()[1]);
	}

	@Test
	public void testRepresentativeImageAndDelete() {
		Product product = Product.builder()
				.pname("상품")
				.price(100)
				.build();
		product.addImageString("IMAGE1.jpg");
		product.addImageString("IMAGE2.jpg");
		productRepository.saveAndFlush(product);

		var result = productRepository.selectList(PageRequest.of(0, 10));
		ProductImage image = (ProductImage) result.getContent().getFirst()[1];

		assertEquals(1, result.getTotalElements());
		assertEquals("IMAGE1.jpg", image.getFileName());
		productRepository.updateToDelete(product.getPno(), true);
		assertFalse(productRepository.selectList(PageRequest.of(0, 10)).hasContent());
	}
}
